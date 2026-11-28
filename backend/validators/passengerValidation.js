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
const phonePattern = /^\+?[\d\s()-]+$/;
const passportPattern = /^[A-Za-z0-9]{5,20}$/;

function parseValidDate(dateString) {
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!datePattern.test(dateString)) {
        return null;
    }
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear()!==year || date.getMonth()!==month - 1 || date.getDate()!==day){
        return null;
    }
    return date;
}

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
    const phoneDigits = passenger.phone.replace(/\D/g, "");
    if (!phonePattern.test(passenger.phone)||phoneDigits.length < 7 ||phoneDigits.length > 15){
        invalidFields.push("phone");
    }

    const birthDate = parseValidDate(passenger.DateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!birthDate || birthDate>today){
        invalidFields.push("DateOfBirth");
    }

    if (!passportPattern.test(passenger.passportNumber.trim())) {
        invalidFields.push("passportNumber");
    }
    return invalidFields;
}