import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";


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
      console.log(`access token: ${access_token}`)
      if (!id_token) {
        return res.status(400).send('Failed to retrieve ID token.');
      }
  
      const decodedToken = jwt.decode(id_token);
  
      const { 
        email,
        name, 
        picture,
        'https://slack.com/team_id' :team_id,
        'https://slack.com/user_id' :user_id,
        given_name,
        family_name,
        'https://slack.com/team_name': worskspace } = decodedToken;
  
        const user = await User.create({
        firstName: given_name,
        lastName: family_name,
        email: email,
        fullName: name,
        slackTeamID: team_id,
        slackUserID: user_id,
        slackWorkspace: worskspace,
        profilePicture: picture,
        
    });
        
      res.send(`Welcome, ${name}!`);
    } catch (error) {
      console.error('Error during Slack sign in:', error.response?.data || error.message);
      res.status(500).send('Error during Slack sign in.');
    }
  };
