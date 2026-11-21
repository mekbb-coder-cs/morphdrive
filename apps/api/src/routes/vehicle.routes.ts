import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller.js";

export const vehicleRouter: Router = Router();

vehicleRouter.get("/bases", VehicleController.listBases);
vehicleRouter.get("/bases/:id", VehicleController.getBaseById);
