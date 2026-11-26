function getPassengerIdentityType(dateOfBirth){
    if (typeof dateOfBirth!=="string") {
        return "Unknown";
    }
    const dateParts = dateOfBirth.split("/");
    if (dateParts.length!==3 || dateParts.some((part) => part.trim()==="")){
        return "Unknown";
    }
    const [day,month,year]=dateParts.map(Number);
    const birthDate=new Date(year,month-1,day);
    const today=new Date();

    if (!Number.isInteger(day) ||!Number.isInteger(month) ||!Number.isInteger(year) ||birthDate.getFullYear()!==year ||birthDate.getMonth()+1!==month ||birthDate.getDate()!==day ||birthDate>today){
        return "Unknown";
    }
    let age=today.getFullYear()-year;
    if (today.getMonth()+1 < month || (today.getMonth()+1===month && today.getDate()<day)){
        age-=1;
    }
    return age>=18 ?"Adult":"Child";
}

//They handle the date format conversion,usually allow the use to enter according to the calendar format or typed format,depending on the browsere,either way once the date is complete the input field provides it in YYYY-MM-DD format
function toDateInputValue(date){ //app format DD/MM/YYYY-> calendar format YYYY-MM-DD
    if (typeof date!=="string"){
        return "";
    }
    const match=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(date);
    if (!match) {
        return "";
    }
    const [,dayText,monthText,yearText]=match;
    const day=Number(dayText);
    const month=Number(monthText);
    const year=Number(yearText);
    const parsedDate=new Date(year,month - 1,day); 
    if (parsedDate.getFullYear()!==year || parsedDate.getMonth()+1!==month || parsedDate.getDate()!==day){
        return "";
    }
    return `${yearText}-${monthText.padStart(2,"0")}-${dayText.padStart(2,"0")}`;
}

function fromDateInputValue(date){//calendar format YYYY-MM-DD -> app format DD/MM/YYYY
    const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!match) {
        return "";
    }
    const [,yearText,monthText,dayText]=match;
    const day=Number(dayText);
    const month=Number(monthText);
    const year=Number(yearText);
    const parsedDate=new Date(year,month-1,day);
    if (parsedDate.getFullYear()!==year || parsedDate.getMonth()+1!==month || parsedDate.getDate()!==day){
        return "";
    }
    return `${dayText}/${monthText}/${yearText}`;
}

//renders one passenger's editable details and sends changes to the parent
export function PassengerCard({passenger,onPassengerChange}){
  const updatePassengerField = (name,value) => {
    onPassengerChange({ ...passenger,[name]:value});
  };
  const handleChange=(event) => {
    updatePassengerField(event.target.name,event.target.value);
  };
  const handleCalendarChange=(fieldName,event) => {
    updatePassengerField(
      fieldName,
      fromDateInputValue(event.target.value)
    );
  };
  return();
}