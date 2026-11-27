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
export function PassengerInfoPage({signedInUser,initialPassengers=[]}){
    const [passengers,setPassengers]=useState(initialPassengers);
    const [isAccountHolder,setIsAccountHolder]=useState(Boolean(signedInUser));

    function handlePassengerChange(index,updatedPassenger){
        setPassengers((previous) =>
            previous.map((passenger,passengerIndex)=>
                passengerIndex===index?updatedPassenger:passenger
            )
        );
    }

    function handleAccountHolderChange(useAccount) {
        setIsAccountHolder(useAccount);
        if (useAccount && signedInUser) {
            setPassengers((previous) =>
                previous.map((passenger,index)=>
                    index === 0?{
                        ...passenger,
                        title: signedInUser.title ?? passenger.title,
                        Gender: signedInUser.Gender ?? signedInUser.gender ?? passenger.Gender,
                        FirstName: signedInUser.FirstName ?? signedInUser.firstName ?? passenger.FirstName,
                        lastName: signedInUser.lastName ?? signedInUser.LastName ?? passenger.lastName,
                        DateOfBirth: signedInUser.DateOfBirth ?? signedInUser.dateOfBirth ?? passenger.DateOfBirth,
                        Nationality: signedInUser.Nationality ?? signedInUser.nationality ?? passenger.Nationality,
                        passportNumber: signedInUser.passportNumber ?? passenger.passportNumber,
                        PassengerExpireDate: signedInUser.PassengerExpireDate ?? signedInUser.passportExpiryDate ?? passenger.PassengerExpireDate,
                        email: signedInUser.email ?? passenger.email,
                        phone: signedInUser.phone ?? passenger.phone,
                    }:passenger
                )
            );
        } else if(!useAccount){
            setPassengers((previous) =>
                previous.map((passenger,index) =>
                    index === 0?{
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
                        phone: "",
                    }:passenger
                )
            );
        }
    }
    return (
    <main className="passenger-info-page">
        <AccountHeader signedInUser={signedInUser} />
        <BookingNavigation activePage="passenger-info" />
        <div className="passenger-list">
            {passengers.map((passenger, index) => (
                <PassengerCard
                    key={passenger.id ?? index}
                    passenger={passenger}
                    signedInUser={signedInUser}
                    isAccountHolder={index === 0 ? isAccountHolder : false}
                    onAccountHolderChange={index === 0?handleAccountHolderChange:()=>{}}
                    onPassengerChange={(updatedPassenger) =>handlePassengerChange(index, updatedPassenger)}
                    passengerNumber={index + 1}
                />
            ))}
        </div>
    </main>
);
}

function AccountHeader({ signedInUser }) {
    if (!signedInUser) {
        return null;
    }
    const firstName=signedInUser.FirstName ?? signedInUser.firstName ?? "";
    const lastName=signedInUser.lastName ?? signedInUser.LastName ?? "";
    return (
        <header className="account-header">
            <div className="account-name">
                {firstName} {lastName? `${lastName.charAt(0)}.` : ""}
            </div>
        </header>
    );
}

function BookingNavigation({ activePage }) {
    const pages = [{id:"search-results",label:"Search Results and Filter"}, {id:"passenger-info",label:"Flight Details & Passenger info"}, {id:"booking-confirmation",label:"Booking Confirmation/E-Ticket"}, {id: "my-trips",label: "My Trips"}];
    return (
        <nav className="booking-navigation">
            {pages.map((page) => (
                <span key={page.id} className={ activePage === page.id ? "navigation-item active":"navigation-item"} aria-current={ activePage === page.id ? "step" : undefined}>{page.label}</span>
            ))}
        </nav>
    );
}
//aria-current tells assistive technologies—especially screen readers—which item represents the current location or step.

//Renders one passenger's editable details and sends changes to the parent
function PassengerCard({passenger,onPassengerChange,isAccountHolder,onAccountHolderChange,passengerNumber,signedInUser}){
    const updatePassengerField=(name,value)=>{
        onPassengerChange({...passenger,[name]:value });
    };
    const handleChange=(event)=>{
        updatePassengerField(event.target.name,event.target.value);
    };
    const handleCalendarChange=(fieldName,event)=>{
        updatePassengerField(fieldName,fromDateInputValue(event.target.value));
    };
    return (
        <section>
            <h2>
                Passenger {passengerNumber}.{getPassengerIdentityType(passenger.DateOfBirth)}
            </h2>
            {passengerNumber===1 && signedInUser &&(
            <> 
            <fieldset>
                <legend> Is this ticket for the signed-in account name({signedInUser.FirstName ?? signedInUser.firstName}{" "}{signedInUser.lastName ?? signedInUser.LastName})?</legend>
                <button type="button" aria-pressed={isAccountHolder === true} onClick={() => onAccountHolderChange(true)}> Yes </button>
                <button type="button" aria-pressed={isAccountHolder === false} onClick={() => onAccountHolderChange(false)}> No </button>
            </fieldset>
            {isAccountHolder && (<p>Your account details were filled in automatically.</p>)}
            </>)}
            
            <label>
                Title
                <input name="title" value={passenger.title ?? ""} onChange={handleChange}/>
            </label>

            <label>
                Gender
                <input name="Gender" value={passenger.Gender ?? ""} onChange={handleChange}/>
            </label>

            <label>
                First name
                <input name="FirstName" value={passenger.FirstName ?? ""} onChange={handleChange}/>
            </label>

            <label>
                Last name
                <input name="lastName" value={passenger.lastName ?? ""} onChange={handleChange}/>
            </label>

            <label>
                Date of birth
                <input type="date" value={toDateInputValue(passenger.DateOfBirth)} onChange={(event) => handleCalendarChange("DateOfBirth", event)}/>
            </label>

            <label>
                Nationality
                <input name="Nationality" value={passenger.Nationality ?? ""} onChange={handleChange} />
            </label>

            <label>
                Passport number
                <input name="passportNumber" value={passenger.passportNumber ?? ""} onChange={handleChange} />
            </label>

            <label>
                Passport expiry date
                <input type="date" value={toDateInputValue(passenger.PassengerExpireDate)} onChange={(event) => handleCalendarChange("PassengerExpireDate", event)}/>
            </label>

            <label>
                Email
                <input type="email" name="email" value={passenger.email ?? ""} onChange={handleChange} />
            </label>

            <label>
                Phone number
                <input type="tel" name="phone" value={passenger.phone ?? ""} onChange={handleChange} />
            </label>
        </section>
    );
}
