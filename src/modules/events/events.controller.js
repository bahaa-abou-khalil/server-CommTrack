export const trackStoreJoin = async (req, res) => {
    try {
        const { event } = req.body;

        if (event.type === "member_joined_channel") {
            const channelId = event.channel;
            const userId = event.user;

            console.log(`User ${userId} joined channel ${channelId}`);

            return res.status(200).send("Member join tracked.");
        }

        res.status(200).send("No events.");
    } catch (error) {
        console.error("Error tracking member join:", error.message);
        return res.status(500).json({ message: "Failed to track member join." });
    }
};

export const slackEvents = (req, res) => {
    const { type, challenge } = req.body;
  
    if (type === 'url_verification') {
        return res.status(200).json({ challenge });
    }
  
    res.status(200).send('Event received');
}