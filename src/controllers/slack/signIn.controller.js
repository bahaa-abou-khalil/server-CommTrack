import axios from "axios";

export const signInSlack = (req, res) => {
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=identity.basic,identity.email,identity.team,identity.avatar&redirect_uri=${process.env.REDIRECTED_SLACK_SIGNIN}`;
  res.redirect(slackAuthUrl);
};

export const signInCallback = async (req, res) => {
    const { code } = req.query;
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
                redirect_uri: process.env.REDIRECTED_SLACK_SIGNIN,
            },
        });

        if (!response.data.ok) {
            return res.status(400).send(`Error in response: ${response.data.error}`);
        }

        const { ok, team, user, access_token } = tokenResponse.data;
        console.log("response: ", tokenResponse.data);

      const userInfo = {
        teamId: team.id,
        teamName: team.name,
        userId: user.id,
        userName: user.name,
        accessToken: access_token,
      };
  
      res.status(200).send(`Welcome, ${userInfo.userName}!`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong during Slack authentication.');
    }
  };
