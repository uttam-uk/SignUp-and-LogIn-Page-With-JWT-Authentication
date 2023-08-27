import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from '../middlewares/auth-middleware.js';
router.use('/loggeduser', checkUserAuth)
router.post('/register', UserController.userRegistration);
router.post('/login', UserController.userLogin);
router.get('/loggeduser', UserController.loggedUser)
export default router;

