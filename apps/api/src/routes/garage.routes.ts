import { Router } from "express";
import { GarageController } from "../controllers/garage.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { CreateVehicleLoadoutSchema, UpdateVehicleLoadoutSchema } from "@morphdrive/shared";

export const garageRouter: Router = Router();

garageRouter.use(authenticate);

garageRouter.get("/loadouts", GarageController.listLoadouts);
garageRouter.get("/loadouts/:id", GarageController.getLoadoutById);
garageRouter.post("/loadouts", validate(CreateVehicleLoadoutSchema), GarageController.createLoadout);
garageRouter.put("/loadouts/:id", validate(UpdateVehicleLoadoutSchema), GarageController.updateLoadout);
garageRouter.delete("/loadouts/:id", GarageController.deleteLoadout);
