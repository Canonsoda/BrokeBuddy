import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser } from '../controller/user.controller.js';

const authRoute = express.Router();

// 🔹 Register route
authRoute.post('/register', registerUser);

// 🔹 Login route
authRoute.post('/login', loginUser);


authRoute.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// 🔹 Google OAuth callback
authRoute.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  (req, res) => {
    const role = req.user.roles || 'both';
    const isNewUser = req.user._isNewUser || false; // ✅ safely extract from user object

    const token = jwt.sign(
      {
        id: req.user._id,
        emailId: req.user.emailId,
        name: req.user.name,
        role,
        isNewUser,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.redirect(`${process.env.CLIENT_URL}/google-auth-success?token=${token}`);
  }
);


export default authRoute;
