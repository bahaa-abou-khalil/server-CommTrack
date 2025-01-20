import { User } from "../../db/models/user.model.js";
import { storeUsersAlerts } from "./alerts.service.js";

export const getUserAlerts = async (req,res) => {
    const id = req.user.id;

    try{
        const user = await User.findById(id)

        const alerts = user.alerts.filter(alert => !alert.isAcknowledged);

        res.json({
            alerts: alerts
        })

    }catch(error){
        console.log(`Error getting user alerts: ${error}`)
        res.status(500).send({message: "Error occured in showing alerts."})
    }
} 


export const acknowledgeAlert = async (req, res) => {
    const { alertId } = req.params;
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

export const getAlertsStats = async (req, res) => {
    try {
        const users = await User.find();

        const usersWithAlertCounts = users.map(user => {
            const alertCounts = user.alerts.reduce((counts, alert) => {
                if (alert.type === 'behaviour') counts.behaviour++;
                if (alert.type === 'engagement') counts.engagement++;
                if (alert.type === 'productivity') counts.productivity++;
                return counts;
            }, { behaviour: 0, engagement: 0, productivity: 0 });

            return {
                name: user.fullName,
                email: user.email,
                alerts: alertCounts,
            };
        });

        res.status(200).json({alertsStats: usersWithAlertCounts});
    } catch (error) {
        console.log(`error in alerts stats: ${error}`)
        res.status(500).json({ message: 'Error occured' });
    }
};