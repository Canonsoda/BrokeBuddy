import express from 'express';
import { getUser, registerUser ,loginUser} from '../controller/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const userRoute = express.Router();

userRoute.get('/', getUser);
userRoute.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});


export default userRoute;