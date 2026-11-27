import FlightCard from "../components/FlightCard";
import flights from "../data/flights";

function SearchResults() {
  return (
    <div className="search-page">
      <div className="search-container">
        <h1>Available Flights</h1>
         <div className="flight-list">

          {flights.map((flight) => (

            <FlightCard
              key={flight.id}
              flight={flight}
            />

          ))}

        </div>
      </div>

    </div>
  );
}

export default SearchResults;