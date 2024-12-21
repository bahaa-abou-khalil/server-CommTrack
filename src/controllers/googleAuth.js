import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';
import passport from "passport"

export const googleAuthentication = () => {
    passport.use(
        new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/google/callback",
            passReqToCallback: true // check
        },
        async (request, accessToken, refreshToken, profile, done) => {

            // User.findOrCreate({ googleID: profile.id }, (error, user)=>{
            
                return done(error,profile);
            // }
       

        }
        )
    );
    
    passport.serializeUser((user, done) => {
    done(null, user);
    });

    // could be like serialization
    passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
    });

}

export const authenticationInfo  = ()=>{
    passport.authenticate('google',{scope: ['email']})
}

