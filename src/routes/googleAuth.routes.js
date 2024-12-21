import { Router } from "express";
import passport from "passport";

import "../middleware/googleAuth.js";
import { authenticateGoogle } from "../middleware/googleAuth.js";
const router = new Router();

router.get("/",authenticateGoogle)
router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/callback/success',
        failureRedirect: '/callback/failure'
}));

router.get('/callback/success' , (req , res) => {
    if(!req.user)
        res.redirect('/callback/failure');
    res.send("Welcome " + req.user.email);
});

router.get('/callback/failure' , (req , res) => {
    res.send("Error");
})
export default router;