function FlightCard({ flight }) {
  return (
    <div className="flight-card">
      <div className="flight-header">
        <div>
          <h3>{flight.logo} {flight.airline}</h3>
          <p>{flight.flightNumber}</p>
        </div>
      </div>
    </div>
  );
}
export default FlightCard;