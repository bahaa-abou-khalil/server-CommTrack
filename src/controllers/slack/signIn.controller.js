import axios from "axios";

export const signInSlack = (req, res) => {
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=identity.basic,identity.email,identity.team,identity.avatar&redirect_uri=${process.env.SLACK_REDIRECT_URI}`;
  res.redirect(slackAuthUrl);
};