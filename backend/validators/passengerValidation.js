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
