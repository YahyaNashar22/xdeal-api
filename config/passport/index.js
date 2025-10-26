import passport from "passport";
import localStrategy from "./localStrategy.js";


passport.use("local", localStrategy);

passport.serializeUser((user, done) => done(null, user.id)); // equivalent to user._id.toString();
passport.deserializeUser((id, done) => {
    import("../../models/user.model.js").then(({ default: User }) => {
        User.findById(id)
            .then((user) => done(null, user))
            .catch((error) => done(error));
    });
});

export default passport;