import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("apps/web/public/models");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage for 3D .glb models
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.toLowerCase().replace(/[^a-z0-9_.-]/g, "_");
    cb(null, safeName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".glb" || file.mimetype === "model/gltf-binary" || file.mimetype === "application/octet-stream") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format. Only binary glTF (.glb) models are allowed."));
    }
  },
});

export class UploadController {
  static async uploadModel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No 3D model file provided" });
      }

      // Validate glTF magic header: 0x46546C67 ("glTF")
      const buffer = fs.readFileSync(req.file.path);
      const magic = buffer.toString("utf8", 0, 4);

      if (magic !== "glTF") {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: "Uploaded file is not a valid binary glTF (.glb) file." });
      }

      const publicUrl = `/models/${req.file.filename}`;
      return res.status(201).json({
        message: "3D Model uploaded successfully",
        filename: req.file.filename,
        sizeBytes: req.file.size,
        publicUrl,
      });
    } catch (err) {
      return next(err);
    }
  }
}
