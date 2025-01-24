import passport from "passport";

export const auth = passport.authenticate("local", {
  session: false,
  failureMessage: true,
});

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = passport.authenticate("google", {
  session: false,
  failureMessage: true,
});
