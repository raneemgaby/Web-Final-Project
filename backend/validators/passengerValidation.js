const requiredFields=["title",
    "Gender",
    "FirstName",
    "lastName",
    "DateOfBirth",
    "Nationality",
    "passportNumber",
    "PassengerExpireDate",
    "email",
    "phone"];
export function validateRequiredFields(passenger){
    if( !passenger||typeof passenger !== "object" || Array.isArray(passenger)){
        return [...requiredFields];
    }
    const missingFields = requiredFields.filter((field) => {
        return (
            typeof passenger[field] !== "string" ||
            passenger[field].trim() === ""
        );
    });
    return missingFields;
}
const allowedTitles = ["Mr","Mrs","Ms","Miss","Dr"];
const allowedGenders = ["Male","Female"];
const namePattern = /^[\p{L}\p{M}]+(?:[ .’'-][\p{L}\p{M}]+)*$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePassengerValues(passenger) {
    const invalidFields = [];
    if (!allowedTitles.includes(passenger.title)) {
        invalidFields.push("title");
    }
    if (!allowedGenders.includes(passenger.Gender)) {
        invalidFields.push("Gender");
    }
    if (!namePattern.test(passenger.FirstName.trim())) {
        invalidFields.push("FirstName");
    }
 
    if (!namePattern.test(passenger.lastName.trim())) {
        invalidFields.push("lastName");
    }
    if (!namePattern.test(passenger.Nationality.trim())) {
        invalidFields.push("Nationality");
    }
    if (!emailPattern.test(passenger.email.trim())) {
        invalidFields.push("email");
    }
    return invalidFields;
}