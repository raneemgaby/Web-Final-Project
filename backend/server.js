import express from "express";
import passengerRoutes from "./routes/passengerRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app=express(); //create the web framework app
const PORT=3000; //define the server's port
app.use(express.json()); //JSON middleware to allow express to parse the incoming JSON request bodies

app.use("/api/passengers", passengerRoutes);

app.get("/",(req,res)=>{ //handling http endpoints
    res.send("Cloud Airlines backend is running!");
});

app.use(errorHandler);

app.listen(PORT,()=>{ //start the http server
    console.log(`Server is running on http://localhost:${PORT}`);
});