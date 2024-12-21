import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model';

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://localhost:8080/google/callback",
        passReqToCallback: true // check
    },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          User.findOrCreate({ googleID: profile.id }, (error, user)=>{
            return done(error,profile);
          });

          

        } catch (error) {
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