import axios from "axios";

export const installSlack = (req, res) => {
    //modify teh scopes
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=commands,chat:write&redirect_uri=${process.env.REDIRECTED_SLACK_LINK}`;
  res.redirect(slackAuthUrl);
  console.log(process.env.SLACK_CLIENT_ID)
  console.log(process.env.REDIRECTED_SLACK_LINK)

};

export const callback = async (req, res) => {
    const code = req.query.code;
    console.log(code)
    if (!code) {
        return res.status(400).send("Missing authorization code");
    }
    
    try {
        const response = await axios.post("https://slack.com/api/oauth.v2.access", null, {
            params: {
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.REDIRECTED_SLACK_LINK,
            },
        });

        if (!response.data.ok) {
            return res.status(400).send(`Error in response: ${response.data.error}`);
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
