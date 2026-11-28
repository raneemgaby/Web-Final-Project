import {validateRequiredFields,validatePassengerValues} from "../validators/passengerValidation.js";

export function getPassengerStatus(req, res) {
    return res.json({message: "Passenger API is working!"});
}

export function submitPassengers(req, res) {
    const { passengers } = req.body ?? {};
    if (!Array.isArray(passengers) || passengers.length === 0) {
        return res.status(400).json({message: "At least one passenger is required."});
    }

    const errors = [];
    passengers.forEach((passenger, index) => {
        const missingFields = validateRequiredFields(passenger);
        if (missingFields.length>0){
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
    return res.status(200).json({
        message: "Passenger information received successfully!",passengerCount: passengers.length});
}
