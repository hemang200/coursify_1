import { Router } from "express";
import {contactUs, userStats, } from '../controllers/miscellaneous.controller.js';
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/contact').post(contactUs);
router.route('/admin/stats/user').get(isLoggedIn, authorizedRoles("admin"), userStats);

export default router;

