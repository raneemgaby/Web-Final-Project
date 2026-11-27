import { useState } from "react";

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
    // Updates the information of an individual passenger
    function handlePassengerChange(index, updatedPassenger) {
        setPassengers((previous)=> previous.map((passenger,passengerIndex)=> passengerIndex===index? updatedPassenger: passenger));
    }
    // Handles the Yes/No account holder question
    function handleAccountHolderChange(useAccount){
        if (!signedInUser || useAccount === isAccountHolder) {
            return;
        }
        setIsAccountHolder(useAccount);

        // Autofill only when the user clicks Yes
        if (useAccount && signedInUser) {
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

        // Clear autofilled information when switching from Yes to No
        else if (!useAccount && isAccountHolder === true) {
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
                        }
                        : passenger
                )
            );
        }
    }
    // Validates an individual passenger's information
    function isPassengerValid(passenger) {
        const requiredFields = ["title","Gender","FirstName","lastName","DateOfBirth","Nationality","passportNumber","PassengerExpireDate","email","phone"];
        
        // Check that all mandatory fields are filled
        const allFieldsFilled= requiredFields.every( (field)=> typeof passenger[field]==="string" && passenger[field].trim()!=="");
        if (!allFieldsFilled) {return false;}

        const namePattern = /^[\p{L}\p{M}]+(?:[ .’'-][\p{L}\p{M}]+)*$/u;
        const validFirstName= namePattern.test(passenger.FirstName.trim());
        const validLastName= namePattern.test(passenger.lastName.trim());
        const validTitle= ["Mr", "Mrs", "Ms", "Miss"].includes(passenger.title);
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


    // Check whether the account holder question has been answered
    const accountQuestionAnswered= !signedInUser || isAccountHolder!==null;

    // Check whether every passenger has valid information
    const isFormValid= passengers.length>0 && accountQuestionAnswered && passengers.every(isPassengerValid);

    // Handles the Continue button
    function handleContinue(event) {
        event.preventDefault();
        if (!isFormValid) {
            return;
        }
        if (typeof onContinue === "function") {
            onContinue(passengers);
        } else {
            alert("Passenger information completed successfully.");
        }
    }
    return (
        <main className="passenger-info-page">
            <AccountHeader signedInUser={signedInUser} />
            <BookingNavigation activePage="passenger-info" />
            <form className="passenger-list" onSubmit={handleContinue}>
                {passengers.map((passenger, index) => (
                    <PassengerCard
                        key={passenger.id ?? index}
                        passenger={passenger}
                        signedInUser={signedInUser}
                        isAccountHolder={index===0? isAccountHolder: false}
                        onAccountHolderChange={index===0? handleAccountHolderChange: ()=>{} }
                        onPassengerChange={(updatedPassenger)=> handlePassengerChange(index,updatedPassenger)}
                        passengerNumber={index + 1}
                    />
                ))}
                {!accountQuestionAnswered && (
                    <p className="validation-message"> Please answer whether the ticket is forthe signed-in account.</p> )}
                {!isFormValid && accountQuestionAnswered && (
                    <p className="validation-message"> Please complete all required passenger information with valid details before continuing.</p> )}
                <button type="submit" className="continue-button" disabled={!isFormValid}>Continue</button>
            </form>
        </main>
    );
}

// Displays the signed-in user's name
function AccountHeader({ signedInUser }) {
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


// Displays the booking progress navigation
function BookingNavigation({ activePage }) {
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

// Displays and updates an individual passenger's form
function PassengerCard({passenger,onPassengerChange,isAccountHolder,onAccountHolderChange,passengerNumber,signedInUser}){
    const updatePassengerField= (name,value)=> { onPassengerChange({...passenger,[name]:value}); };
    const handleChange= (event)=> { updatePassengerField(event.target.name,event.target.value); };
    const handleCalendarChange= (fieldName,event) => { updatePassengerField(fieldName,fromDateInputValue(event.target.value)); };
    const today = new Date();
    const todayDate=`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
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
                <select name="title" value={passenger.title ?? ""} onChange={handleChange} required>
                    <option value="">Select title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr</option>
                </select>
            </label>
            <label>
                Gender
                <select name="Gender" value={passenger.Gender ?? ""} onChange={handleChange} required>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </label>

            <label>
                First name
                <input name="FirstName" value={passenger.FirstName ?? ""} onChange={handleChange}required/>
            </label>

            <label>
                Last name
                <input name="lastName" value={passenger.lastName ?? ""} onChange={handleChange}required/>
            </label>

            <label>Date of birth
                <input type="date" value={toDateInputValue(passenger.DateOfBirth)} max={todayDate} onChange={(event)=> handleCalendarChange("DateOfBirth", event)}required/>
            </label>

            <label>
                Nationality
                <input name="Nationality" value={passenger.Nationality ?? ""} onChange={handleChange}required/>
            </label>

            <label>
                Passport number
                <input name="passportNumber" value={passenger.passportNumber ?? ""} onChange={handleChange} minLength={5} maxLength={20}required/>
            </label>

            <label>
                Passport expiry date
                <input type="date" value={toDateInputValue(passenger.PassengerExpireDate)} min={todayDate} onChange={(event) =>handleCalendarChange("PassengerExpireDate",event)}required/>
            </label>

            <label>
                Email
                <input type="email" name="email" value={passenger.email ?? ""} onChange={handleChange} required/>
            </label>

            <label>
                Phone number
                <input type="tel" name="phone" value={passenger.phone ?? ""} onChange={handleChange} required/>
            </label>
        </section>
    );
}
