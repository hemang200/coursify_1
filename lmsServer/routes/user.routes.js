import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser
} from '../controllers/user.controller.js';

import { isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js'; // make sure you export default

const router = Router();

// Public routes
router.post('/register', upload.single("avatar"), register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset', forgotPassword);
router.post('/reset/:resetToken', resetPassword);

// Authenticated routes
router.get('/me', isLoggedIn, getProfile);
router.post('/change-password', isLoggedIn, changePassword);
router.put('/update/:id', isLoggedIn, upload.single("avatar"), updateUser);

export default router;
