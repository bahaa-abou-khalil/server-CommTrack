import passport from "passport";
import jwt from "jsonwebtoken";
import "./auth.service.js";

export const authenticateGoogle = passport.authenticate('google', { scope: ['email','profile'] });

export const redirectAuth = 
    passport.authenticate( 'google', {
        successRedirect: '/callback/success',
        failureRedirect: '/callback/failure'
    })

export const callbackSuccess = (req, res) => {
    if (!req.user) {
        return res.redirect('/callback/failure');
    }
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
    

    res.json({ message: "Welcome " + req.user.firstName, token });
};

export const callbackFailure = (req , res) => {
    res.send("Error");
}

