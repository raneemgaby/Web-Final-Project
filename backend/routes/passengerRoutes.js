import express from "express";
import { getPassengerStatus,submitPassengers } from "../controllers/passengerController.js";

const router=express.Router();

router.get("/",getPassengerStatus);
router.post("/",submitPassengers);

export default router;