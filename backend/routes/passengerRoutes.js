import express from "express";
import { validateRequiredFields,validatePassengerValues } from "../validators/passengerValidation.js";

const router=express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Passenger API is working!"
    });
});
router.post("/",(req,res)=>{
    const{passengers}=req.body??{};
    if(!Array.isArray(passengers) || passengers.length===0){
        return res.status(400).json({message:"At least one passenger is required."});
    }

    const errors=[];
    passengers.forEach((passenger, index) => {
        const missingFields = validateRequiredFields(passenger);

        if(missingFields.length > 0){
            errors.push({passengerNumber: index + 1,missingFields: missingFields});
            return;
        }

        const invalidFields = validatePassengerValues(passenger);
        if (invalidFields.length > 0) {
            errors.push({passengerNumber: index + 1,invalidFields: invalidFields});
        }
    });
    if (errors.length > 0) {
        return res.status(400).json({message: "Passenger validation failed.",errors: errors});
    }
    return res.status(200).json({message: "Passenger information received successfully!",passengerCount: passengers.length});
});
export default router;