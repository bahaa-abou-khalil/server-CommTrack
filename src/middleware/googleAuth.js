import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';
import passport from "passport";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const { givenName, familyName } = profile.name;

            try {
                let user = await User.findOne({ googleID: profile.id });
                if (!user) {
                    user = await User.create({
                        firstName: givenName,
                        lastName: familyName,
                        googleID: profile.id,
                        email: profile.emails[0]?.value
                    });
                }
                return done(null, user);
            } catch (error) {
                console.error("Error in Google Strategy:", error);
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export const authenticateGoogle = passport.authenticate('google', { scope: ['email','profile'] });
