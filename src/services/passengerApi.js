
const API_URL = "http://localhost:3000/api/passengers";

export async function submitPassengerInformation(passengers) {
    const response = await fetch(API_URL,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({passengers: passengers})
    });

    const data = await response.json();

    return {ok: response.ok,status: response.status,data: data};
}
