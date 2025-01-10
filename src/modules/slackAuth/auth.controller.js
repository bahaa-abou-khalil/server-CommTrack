import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../../db/models/user.model.js";


export const signInWithSlack = (req, res) => {
    const slackAuthURL = `https://slack.com/openid/connect/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=openid,email,profile&response_type=code&redirect_uri=${process.env.REDIRECTED_SLACK_SIGNIN}`;
    res.redirect(slackAuthURL);
  };
  
export const signInCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
    return res.status(400).send('Authorization code is missing.');
    }

    try {
    const tokenResponse = await axios.post(
        'https://slack.com/api/openid.connect.token',
        new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: process.env.REDIRECTED_SLACK_SIGNIN,
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, id_token } = tokenResponse.data;
    // console.log(`Access token: ${access_token}`);
    
    if (!id_token) {
        return res.status(400).send('Failed to retrieve ID token.');
    }

    const decodedToken = jwt.decode(id_token);

    const { 
        email,
        name, 
        picture,
        'https://slack.com/team_id': team_id,
        'https://slack.com/user_id': slack_user_id,
        given_name,
        family_name,
        'https://slack.com/team_name': workspace 
    } = decodedToken;

    let user = await User.findOne({ slackUserID: slack_user_id });

    if (!user) {
        user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email: email,
        fullName: name,
        slackTeamID: team_id,
        slackUserID: slack_user_id,
        slackWorkspace: workspace,
        profilePicture: picture,
        role: "member"
        });
    }

    const payload = {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        slackUserID: user.slackUserID,
        slackTeamID: user.slackTeamID,
    };

    // i should add expire date
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);
  
    res.redirect(`http://localhost:3000/?token=${jwtToken}`);
  
    } catch (error) {
      console.error('Error during Slack sign in:', error.response?.data || error.message);
      res.status(500).send('Error during Slack sign in.');
    }
};
