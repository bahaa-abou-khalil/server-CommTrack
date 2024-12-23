export const calbackInstall = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send("Missing authorization code");
    }

    try {
        const response = await axios.post("https://slack.com/api/oauth.v2.access", null, {
            params: {
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                code: code,
                redirect_uri: `https://${REDIRECTED_SLACK_LINK}/oauth/callback`,
            },
        });

        if (!response.data.ok) {
            return res.status(400).send(`Error: ${response.data.error}`);
        }

        const { access_token, team, authed_user } = response.data;

        console.log("Access Token:", access_token);
        console.log("Team Info:", team);
        console.log("Authorized User:", authed_user);

        res.send("App successfully installed.");
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send("");
    }
};
