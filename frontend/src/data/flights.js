const flights = [
  {
    id: 1,
    airline: "Turkish Airlines",
    flightNumber: "TK 1981",
    logo: "🇹🇷",

    departure: {
      city: "Istanbul",
      airport: "IST",
      time: "06:15"
    },

    arrival: {
      city: "London",
      airport: "LHR",
      time: "08:10"
    },

    duration: 235,
    stops: 0,

    classes: {
      economy: {
        price: 320,
        seats: 15
      },

      comfort: {
        price: 890,
        seats: 8
      },

      vip: {
        price: 1450,
        seats: 5
      }
    }
  },

  {
    id: 2,
    airline: "British Airways",
    flightNumber: "BA 675",
    logo: "🇬🇧",

    departure: {
      city: "Istanbul",
      airport: "IST",
      time: "10:40"
    },

    arrival: {
      city: "London",
      airport: "LHR",
      time: "12:35"
    },

    duration: 235,
    stops: 0,
    classes: {
      economy: {
        price: 355,
        seats: 12
      },

      comfort: {
        price: 975,
        seats: 6
      },

      vip: {
        price: 1620,
        seats: 3
      }
    }
  },

  {
    id: 3,
    airline: "Lufthansa",
    flightNumber: "LH 1359",
    logo: "🇩🇪",

    departure: {
      city: "Istanbul",
      airport: "IST",
      time: "09:05"
    },

    arrival: {
      city: "London",
      airport: "LHR",
      time: "13:50"
    },

    duration: 285,
    stops: 1,
    classes: {
      economy: {
        price: 285,
        seats: 20
      },

      comfort: {
        price: 760,
        seats: 10
      },

      vip: {
        price: 1290,
        seats: 4
      }
    }
  }
];

export default flights;