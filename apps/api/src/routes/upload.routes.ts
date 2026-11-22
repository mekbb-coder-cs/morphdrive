import { Router } from "express";
import { UploadController, upload } from "../controllers/upload.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { Role } from "@prisma/client";

export const uploadRouter: Router = Router();

uploadRouter.post(
  "/model",
  authenticate,
  requireRole(Role.INSTRUCTOR, Role.ADMIN),
  upload.single("model"),
  UploadController.uploadModel
);
