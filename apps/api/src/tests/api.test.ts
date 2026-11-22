import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { prisma } from "../lib/prisma.js";
import app from "../server.js";

describe("MorphDrive Enterprise API Integration Test Suite", () => {
  it("GET /health -> returns 200 with service info", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("morphdrive-api");
  });

  it("GET /api-docs -> renders Swagger UI HTML documentation", async () => {
    const res = await request(app).get("/api-docs/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Swagger UI");
  });

  it("POST /api/auth/register -> creates a new user and issues JWT", async () => {
    // Mock prisma user calls for standalone test execution
    vi.spyOn(prisma.user, "findFirst").mockResolvedValueOnce(null);
    vi.spyOn(prisma.user, "create").mockResolvedValueOnce({
      id: "mock-student-uuid",
      email: "student_test@morphdrive.io",
      username: "student_test",
      passwordHash: "mockHash",
      role: "STUDENT",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "student_test@morphdrive.io",
        username: "student_test",
        password: "securePassword123!",
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.role).toBe("STUDENT");
    expect(res.body.accessToken).toBeDefined();
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("POST /api/auth/register with invalid payload -> returns 400 validation error", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "not-an-email",
        password: "short",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
    expect(res.body.issues).toBeDefined();
  });

  it("POST /api/auth/login with invalid credentials -> returns 401", async () => {
    vi.spyOn(prisma.user, "findFirst").mockResolvedValueOnce(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        login: "nonexistent@morphdrive.io",
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("POST /api/machines without token -> returns 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/machines")
      .send({
        slug: "unauthorized-machine",
        name: "Unauthorized Machine",
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Authentication required");
  });

  it("POST /api/upload/model without file -> returns 401 Unauthorized when unauthenticated", async () => {
    const res = await request(app)
      .post("/api/upload/model");

    expect(res.status).toBe(401);
  });
});
