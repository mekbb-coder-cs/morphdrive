import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { RegisterUserSchema, LoginUserSchema } from "@morphdrive/shared";

export const authRouter: Router = Router();

authRouter.post("/register", validate(RegisterUserSchema), AuthController.register);
authRouter.post("/login", validate(LoginUserSchema), AuthController.login);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/me", authenticate, AuthController.me);
