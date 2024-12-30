import axios from "axios";

export const signInWithSlack = (req, res) => {
    const slackAuthURL = `https://slack.com/openid/connect/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=openid,email,profile&response_type=code&redirect_uri=${process.env.REDIRECTED_SLACK_SIGNIN}`;
    res.redirect(slackAuthURL);
  };

