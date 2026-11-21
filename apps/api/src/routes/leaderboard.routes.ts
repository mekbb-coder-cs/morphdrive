import { Router } from "express";
import { LeaderboardController } from "../controllers/leaderboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { SubmitLapTimeSchema } from "@morphdrive/shared";

export const leaderboardRouter: Router = Router();

leaderboardRouter.get("/tracks", LeaderboardController.listTracks);
leaderboardRouter.get("/tracks/:trackId", LeaderboardController.getTrackLeaderboard);
leaderboardRouter.post("/submit", authenticate, validate(SubmitLapTimeSchema), LeaderboardController.submitLap);
