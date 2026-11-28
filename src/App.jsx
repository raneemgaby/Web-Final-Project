import { PassengerInfoPage } from "./components/PassengerInfoPage.jsx";

function App() {
    const initialPassengers = [{title: "",Gender: "",FirstName: "",lastName: "",DateOfBirth: "",Nationality: "",passportNumber: "",PassengerExpireDate: "",email: "",phone: ""}];

    function handlePassengerContinue(passengers) {
        alert("Passenger information accepted by the backend!");
    }

    return ( <PassengerInfoPage signedInUser={null} initialPassengers={initialPassengers} onContinue={handlePassengerContinue}/> );
}

export default App;
