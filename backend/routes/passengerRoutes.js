import express from "express";
const router = express.Router();
router.get("/", (req, res) => {
    res.json({
        message: "Passenger API is working!"
    });
});

router.post("/",(req,res)=>{
    const{passengers}=req.body??{};
    if(!Array.isArray(passengers) || passengers.length===0){
        return res.status(400).json({message:"At least one passenger is required."});
    }
    return res.status(200).json({message:"Passenger information recieved successfully!",passengerCount:passengers.length});
});
export default router;
