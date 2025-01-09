import { User } from "../../db/models/user.model.js";
import { storeUsersAlerts } from "./alerts.service.js";

export const getUserAlerts = async (req,res) => {
    const id = req.user.id;

    try{
        const user = await User.findById(id)

        res.json({
            alerts: user.alerts
        })

    }catch(error){
        console.log(`Error getting user alerts: ${error}`)
        res.status(500).send({message: "Error occured in showing alerts."})
    }
} 