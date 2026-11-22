import { Request, Response, NextFunction } from "express";
import { hash, verify } from "@node-rs/argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { RegisterUserInput, LoginUserInput } from "@morphdrive/shared";
import { Role } from "@prisma/client";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "fallback_morphdrive_secret_key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "fallback_refresh_morphdrive_key";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, username, password }: RegisterUserInput = req.body;
      const requestedRole: Role = req.body.role && ["STUDENT", "INSTRUCTOR"].includes(req.body.role) 
        ? req.body.role 
        : Role.STUDENT;

      const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (existing) {
        return res.status(409).json({ error: "User with this email or username already exists" });
      }

      const passwordHash = await hash(password);
      const user = await prisma.user.create({
        data: { email, username, passwordHash, role: requestedRole },
      });

      const tokenPayload = { userId: user.id, email: user.email, username: user.username, role: user.role };
      const accessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, { expiresIn: "7d" });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        user: { id: user.id, email: user.email, username: user.username, role: user.role, createdAt: user.createdAt },
        accessToken,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password }: LoginUserInput = req.body;

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: login }, { username: login }],
        },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const valid = await verify(user.passwordHash, password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const tokenPayload = { userId: user.id, email: user.email, username: user.username, role: user.role };
      const accessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, { expiresIn: "7d" });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        user: { id: user.id, email: user.email, username: user.username, role: user.role, createdAt: user.createdAt },
        accessToken,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token missing" });
      }

      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
        userId: string;
        email: string;
        username: string;
        role: Role;
      };

      const newAccessToken = jwt.sign(
        { userId: payload.userId, email: payload.email, username: payload.username, role: payload.role },
        JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    return res.json({ message: "Successfully logged out" });
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, email: true, username: true, role: true, createdAt: true },
      });
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
}
