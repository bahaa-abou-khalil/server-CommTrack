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


export const acknowledgeAlert = async (req, res) => {
    const { alertId } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(500).json({ message: "Something went wrong." });
        }

        const alert = user.alerts.find(alert => alert._id.toString() === alertId);
        if (!alert) {
            return res.status(500).json({ message: "Something went wrong." });
        }

        alert.isAcknowledged = true;

        await user.save();

        res.status(200).json({ message: "Alert acknowledged successfully" });
    } catch (error) {
        console.error(`Error in acknowledging alert: ${error}`);
        res.status(500).json({ error: "Something went wrong." });
    }
};