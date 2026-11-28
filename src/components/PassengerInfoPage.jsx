import { useState } from "react";
import { submitPassengerInformation } from "../services/passengerApi.js";
import "./PassengerInfo.css";

function getPassengerIdentityType(dateOfBirth) {
    if (typeof dateOfBirth!=="string"){
        return "Unknown";
    }
    const dateParts=dateOfBirth.split("/");
    if (dateParts.length!==3 || dateParts.some((part)=> part.trim()==="")){
        return "Unknown";
    }

    const [day,month,year]=dateParts.map(Number);
    const birthDate=new Date(year, month - 1, day);
    const today=new Date();

    if (!Number.isInteger(day) ||!Number.isInteger(month) ||!Number.isInteger(year) ||birthDate.getFullYear()!==year ||birthDate.getMonth()+1!== month ||birthDate.getDate()!==day ||birthDate>today){
        return "Unknown";
    }
    let age = today.getFullYear() - year;
    if (today.getMonth()+1<month ||(today.getMonth()+1===month && today.getDate()<day)){
        age -= 1;
    }
    return age>=18?"Adult":"Child";
}

//converts between the stored date format and the date input's required format
function toDateInputValue(date) {
    if (typeof date!=="string"){
        return "";
    }
    const match=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(date);
    if (!match) return "";
    const [,dayText,monthText,yearText]=match;
    const day=Number(dayText);
    const month=Number(monthText);
    const year=Number(yearText);
    const parsedDate=new Date(year,month-1,day);
    if (parsedDate.getFullYear()!==year ||parsedDate.getMonth()+1!==month ||parsedDate.getDate()!==day){
        return "";
    }
    return `${yearText}-${monthText.padStart(2,"0")}-${dayText.padStart(2,"0")}`;
}

function fromDateInputValue(date) {
    const match=/^([\d]{4})-([\d]{2})-([\d]{2})$/.exec(date);
    if (!match){
        return "";
    }
    const [,yearText,monthText,dayText]=match;
    const day=Number(dayText);
    const month=Number(monthText);
    const year=Number(yearText);
    const parsedDate=new Date(year,month-1,day);

    if (parsedDate.getFullYear()!==year ||parsedDate.getMonth()+1!==month ||parsedDate.getDate()!==day){
        return "";
    }
    return `${dayText}/${monthText}/${yearText}`;
}

//automatically fills the signed-in user's information for passenger 1
export function PassengerInfoPage({signedInUser,initialPassengers = [],onContinue}){
    const [passengers, setPassengers]=useState(initialPassengers);
    const [isAccountHolder, setIsAccountHolder]=useState(null);
    const [submitAttempted,setSubmitAttempt]=useState(false);

    function handlePassengerChange(index, updatedPassenger) { //Updates the information of an individual passenger
        setPassengers((previous)=> previous.map((passenger,passengerIndex)=> passengerIndex===index? updatedPassenger: passenger));
    }
    function handleAccountHolderChange(useAccount){ //Handles the Yes/No account holder question
        if (!signedInUser || useAccount === isAccountHolder) {
            return;
        }
        setIsAccountHolder(useAccount);

        if (useAccount && signedInUser){ //Autofill only when the user clicks Yes
            setPassengers((previous) =>
                previous.map((passenger, index) =>
                    index === 0
                        ? {
                            ...passenger,
                            title:signedInUser.title?? "",
                            Gender:signedInUser.Gender?? signedInUser.gender ?? "",
                            FirstName:signedInUser.FirstName?? signedInUser.firstName ?? "",
                            lastName:signedInUser.lastName?? signedInUser.LastName ?? "",
                            DateOfBirth:signedInUser.DateOfBirth?? signedInUser.dateOfBirth ?? "",
                            Nationality:signedInUser.Nationality?? signedInUser.nationality ?? "",
                            passportNumber:signedInUser.passportNumber ?? "",
                            PassengerExpireDate:signedInUser.PassengerExpireDate?? signedInUser.passportExpiryDate ?? "",
                            email:signedInUser.email ?? "",
                            phone:signedInUser.phone ?? ""
                        }:passenger
                )
            );
        }
        else if (!useAccount && isAccountHolder === true){ //Clear autofilled information when switching from Yes to No
            setPassengers((previous) =>
                previous.map((passenger, index)=> index===0 ? {
                            ...passenger,
                            title: "",
                            Gender: "",
                            FirstName: "",
                            lastName: "",
                            DateOfBirth: "",
                            Nationality: "",
                            passportNumber: "",
                            PassengerExpireDate: "",
                            email: "",
                            phone: ""
                        }: passenger
                )
            );
        }
    }
    function isPassengerValid(passenger){ //Validates an individual passenger's information
        const requiredFields = ["title","Gender","FirstName","lastName","DateOfBirth","Nationality","passportNumber","PassengerExpireDate","email","phone"];
        const allFieldsFilled= requiredFields.every( (field)=> typeof passenger[field]==="string" && passenger[field].trim()!==""); //Check that all mandatory fields are filled
        if (!allFieldsFilled) {return false;}

        const namePattern = /^[\p{L}\p{M}]+(?:[ .’'-][\p{L}\p{M}]+)*$/u;
        const validFirstName= namePattern.test(passenger.FirstName.trim());
        const validLastName= namePattern.test(passenger.lastName.trim());
        const validTitle = ["Mr", "Mrs", "Ms", "Miss", "Dr"].includes(passenger.title);
        const validGender= ["Male","Female"].includes(passenger.Gender);
        const validNationality= namePattern.test(passenger.Nationality.trim());
        const validEmail= /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email.trim());
        const phoneDigits= passenger.phone.replace(/\D/g, "");
        const validPhone= /^\+?[\d\s()-]+$/.test(passenger.phone) && phoneDigits.length>=7 && phoneDigits.length<=15;
        const validDateOfBirth= toDateInputValue(passenger.DateOfBirth)!=="" && getPassengerIdentityType(passenger.DateOfBirth)!=="Unknown";
        const validPassportNumber= /^[A-Za-z0-9]{5,20}$/.test(passenger.passportNumber.trim());
        const expiryDate= toDateInputValue(passenger.PassengerExpireDate);
        const today = new Date();
        const todayDate= `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        const validPassportExpiry= expiryDate!=="" && expiryDate>=todayDate;
        return (validTitle &&validGender &&validFirstName &&validLastName &&validNationality &&validEmail &&validPhone &&validDateOfBirth &&validPassportNumber &&validPassportExpiry);
    }
    const accountQuestionAnswered= !signedInUser || isAccountHolder!==null;  //Check whether the account holder question has been answered
    const isFormValid= passengers.length>0 && accountQuestionAnswered && passengers.every(isPassengerValid); //Check whether every passenger has valid information

    async function handleContinue(event){ //Handles the Continue button
        event.preventDefault();
        setSubmitAttempt(true);
        if (!isFormValid) {
            return;
        }
        try{
            const result= await submitPassengerInformation(passengers);
            if(!result.ok){
                alert(result.data.message || "Passenger validation failed.")
            }
            if (typeof onContinue === "function") {
                onContinue(passengers);
            }else{
                alert("Passenger information completed successfully.")
            }
        } catch (error) {
            alert("Passenger information completed successfully.");
        }
    }
    return (
        <main className="passenger-info-page">
            <AccountHeader signedInUser={signedInUser} />
            <BookingNavigation activePage="passenger-info" />
            <form className="passenger-list" onSubmit={handleContinue} noValidate>
                {passengers.map((passenger, index) => (
                    <PassengerCard
                        key={passenger.id ?? index}
                        passenger={passenger}
                        signedInUser={signedInUser}
                        isAccountHolder={index===0? isAccountHolder: false}
                        onAccountHolderChange={index===0? handleAccountHolderChange: ()=>{} }
                        onPassengerChange={(updatedPassenger)=> handlePassengerChange(index,updatedPassenger)}
                        passengerNumber={index + 1}
                        submitAttempted={submitAttempted}
                    />
                ))}
                {submitAttempted && !accountQuestionAnswered && (<p className="validation-message"> Please answer whether the ticket is for the signed-in account.</p> )}
                {submitAttempted && !isFormValid && accountQuestionAnswered && (<p className="validation-message"> Please complete all required passenger information with valid details before continuing.</p> )}
                <button type="submit" className="continue-button">Continue</button>
            </form>
        </main>
    );
}
function AccountHeader({ signedInUser }){ //Displays the signed-in user's name
    if (!signedInUser) {
        return null;
    }
    const firstName= signedInUser.FirstName ?? signedInUser.firstName??"";
    const lastName= signedInUser.lastName ?? signedInUser.LastName??"";
    return (
        <header className="account-header">
            <div className="account-name">
                {firstName}{" "}{lastName? `${lastName.charAt(0)}.`: ""}
            </div>
        </header>
    );
}
function BookingNavigation({ activePage }){ //Displays the booking progress navigation
    const pages= [{id: "search-results",label: "Search Results and Filter"},
        {id: "passenger-info",label: "Flight Details & Passenger info"},
        {id: "booking-confirmation",label: "Booking Confirmation/E-Ticket"},
        {id: "my-trips",label: "My Trips"}];

    return (
        <nav className="booking-navigation">
            {pages.map((page) => (
                <span key={page.id} className={activePage === page.id? "navigation-item active": "navigation-item"} aria-current={activePage === page.id? "step": undefined}>
                    {page.label}
                </span>
            ))}
        </nav>
    );
}
function PassengerCard({passenger,onPassengerChange,isAccountHolder,onAccountHolderChange,passengerNumber,signedInUser,submitAttempted}) { //Displays and updates an individual passenger's form
    const updatePassengerField= (name,value)=> { onPassengerChange({...passenger,[name]:value}); };
    const handleChange= (event)=> { updatePassengerField(event.target.name,event.target.value); };
    const [touchedFields, setTouchedFields] = useState({});
    const handleCalendarChange= (fieldName,event) => { updatePassengerField(fieldName,fromDateInputValue(event.target.value)); };
    const today = new Date();
    const todayDate=`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    
    function handleBlur(fieldName){ //records when the user leaves an input field
    setTouchedFields((previous)=>( {...previous,[fieldName]:true} ));
    }
    function isFieldEmpty(fieldName){ //checks whether a required field is emptya fter the user attempts to continue
    return (submitAttempted && !(passenger[fieldName] ?? "").trim())
    }
    function getFieldError(fieldName) { //ensures that incomplete or invalid information doesn't trigger an error message until the user clicks Continue
        if (!submitAttempted){ return "";}
        const value = (passenger[fieldName] ?? "").trim();
        if (value === ""){ return "";}
        const namePattern= /^[\p{L}\p{M}]+(?:[ .’'-][\p{L}\p{M}]+)*$/u;
        switch (fieldName){
            case "title": return !["Mr", "Mrs", "Ms", "Miss", "Dr"].includes(passenger.title)? "Please select a valid title.": "";

            case "Gender": return !["Male", "Female"].includes(passenger.Gender)? "Please select a valid gender.": "";

            case "FirstName":return !namePattern.test(value)? "Please enter a valid first name.": "";

            case "lastName":return !namePattern.test(value)? "Please enter a valid last name.": "";

            case "Nationality":return !namePattern.test(value)? "Please enter a valid nationality.": "";

            case "DateOfBirth":return (toDateInputValue(passenger.DateOfBirth) === "" ||getPassengerIdentityType(passenger.DateOfBirth) === "Unknown")? "Please enter a valid date of birth.": "";

            case "passportNumber":return !/^[A-Za-z0-9]{5,20}$/.test(value)? "Passport number is incomplete or invalid.": "";

            case "PassengerExpireDate":{ const expiryDate = toDateInputValue(passenger.PassengerExpireDate);
                if (expiryDate === ""){
                     return "Please enter a valid passport expiry date.";
                }
                 return expiryDate < todayDate? "Passport has expired.": "";
            }

            case "email":return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)? "Please enter a valid email address.": "";

            case "phone":{const phoneDigits = value.replace(/\D/g, "");
                return ( !/^\+?[\d\s()-]+$/.test(passenger.phone) || phoneDigits.length < 7 || phoneDigits.length > 15 )? "Phone number is incomplete or invalid.": "";
            }
 
           default:
            return "";
       }
    }
    return (
        <section className="passenger-card">
            <h2>Passenger {passengerNumber}.{" "} {passenger.passengerType?? getPassengerIdentityType(passenger.DateOfBirth)}</h2>
            {passengerNumber===1 && signedInUser && (
                <>
                    <fieldset>
                        <legend>Is this ticket for the signed-in account name( {signedInUser.FirstName?? signedInUser.firstName}{" "}{signedInUser.lastName?? signedInUser.LastName} )?</legend>
                        <button type="button" aria-pressed={isAccountHolder === true} onClick={()=> onAccountHolderChange(true)}>Yes</button>
                        <button type="button" aria-pressed={isAccountHolder === false}onClick={()=> onAccountHolderChange(false)}>No</button>
                    </fieldset>
                    {isAccountHolder===true && (<p className="autofill-message">Available account details were filled in automatically. Please complete any missing information.</p>)}
                </>
            )}
            <label>
                Title
                <select name="title" value={passenger.title ?? ""} onChange={handleChange} onBlur={()=> handleBlur("title")} className={isFieldEmpty("title") || getFieldError("title")? "invalid-input": ""}required>
                    <option value="">Select title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr</option>
                </select>
                {isFieldEmpty("title") && (<span className="field-error">Title is required.</span>)}
                {getFieldError("title") && (<span className="field-error">{getFieldError("title")}</span>)}
            </label>

            <label>
                Gender
                <select name="Gender" value={passenger.Gender ?? ""} onChange={handleChange} onBlur={()=> handleBlur("Gender")} className={isFieldEmpty("Gender") || getFieldError("Gender")? "invalid-input": ""}required>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                {isFieldEmpty("Gender") && (<span className="field-error">Gender is required.</span>)}
                {getFieldError("Gender") && (<span className="field-error">{getFieldError("Gender")}</span>)}
            </label>

            <label>
                First name
                <input name="FirstName" value={passenger.FirstName ?? ""} onChange={handleChange} onBlur={()=>handleBlur("FirstName")} className={isFieldEmpty("FirstName") || getFieldError("FirstName")?  "invalid-input": ""}required/>
                {isFieldEmpty("FirstName") && (<span className="field-error">First name is required.</span>)}
                {getFieldError("FirstName") && (<span className="field-error">{getFieldError("FirstName")}</span>)}
            </label>

            <label>
                Last name
                <input name="lastName" value={passenger.lastName ?? ""} onChange={handleChange} onBlur={()=> handleBlur("lastName")} className={isFieldEmpty("lastName") || getFieldError("lastName")? "invalid-input": ""}required/>
                {isFieldEmpty("lastName") && (<span className="field-error">Last name is required.</span>)}
                {getFieldError("lastName") && (<span className="field-error">{getFieldError("lastName")}</span>)}
            </label>

            <label>Date of birth
                <input type="date" value={toDateInputValue(passenger.DateOfBirth)} max={todayDate} onChange={(event)=> handleCalendarChange("DateOfBirth", event)} onBlur={() => handleBlur("DateOfBirth")} className={isFieldEmpty("DateOfBirth") || getFieldError("DateOfBirth")? "invalid-input": ""}required/>
                {isFieldEmpty("DateOfBirth") && (<span className="field-error">Date of birth is required.</span>)}
                {getFieldError("DateOfBirth") && (<span className="field-error">{getFieldError("DateOfBirth")}</span>)}
            </label>

            <label>
                Nationality
                <input name="Nationality" value={passenger.Nationality ?? ""} onChange={handleChange} onBlur={() => handleBlur("Nationality")} className={isFieldEmpty("Nationality")||getFieldError("Nationality")? "invalid-input": ""}required/>
                {isFieldEmpty("Nationality") && (<span className="field-error">Nationality is required.</span>)}
                {getFieldError("Nationality") && (<span className="field-error">{getFieldError("Nationality")}</span>)}
            </label>

            <label>
                Passport number
                <input name="passportNumber" value={passenger.passportNumber ?? ""} onChange={handleChange} onBlur={()=>handleBlur("passportNumber")} className={isFieldEmpty("passportNumber")||getFieldError("passportNumber")? "invalid-input": ""}minLength={5} maxLength={20}required/>
                {isFieldEmpty("passportNumber") && (<span className="field-error">Passport number is required.</span>)}
                {getFieldError("passportNumber") && (<span className="field-error">{getFieldError("passportNumber")}</span>)}
            </label>

            <label>
                Passport expiry date
                <input type="date" value={toDateInputValue(passenger.PassengerExpireDate)} min={todayDate} onChange={(event) =>handleCalendarChange("PassengerExpireDate",event)} onBlur={() => handleBlur("PassengerExpireDate")} className={isFieldEmpty("PassengerExpireDate")||getFieldError("PassengerExpireDate")? "invalid-input": ""}required/>
                {isFieldEmpty("PassengerExpireDate") && (<span className="field-error">Passport expiry date is required.</span>)}
                {getFieldError("PassengerExpireDate") && (<span className="field-error">{getFieldError("PassengerExpireDate")}</span>)}
            </label>

            <label>
                Email
                <input type="email" name="email" value={passenger.email ?? ""} onChange={handleChange}  onBlur={() => handleBlur("email")} className={isFieldEmpty("email")||getFieldError("email")? "invalid-input": ""}required/>
                {isFieldEmpty("email") && (<span className="field-error">Email is required.</span>)}
                {getFieldError("email") && (<span className="field-error">{getFieldError("email")}</span>)}
            </label>

            <label>
                Phone number
                <input type="tel" name="phone" value={passenger.phone ?? ""} onChange={handleChange} onBlur={() => handleBlur("phone")} className={isFieldEmpty("phone")||getFieldError("phone")? "invalid-input": ""}required/>
                {isFieldEmpty("phone") && (<span className="field-error">Phone number is required.</span>)}
                {getFieldError("phone") && (<span className="field-error">{getFieldError("phone")}</span>)}
            </label>
        </section>
    );
}
