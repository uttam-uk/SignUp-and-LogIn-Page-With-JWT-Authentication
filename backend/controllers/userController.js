import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

class UserController {
    static userRegistration = async (req, res) => {
        const { name, email, password, password_confirmation, mobile, place } = req.body;
        try {
            if (!name || !email || !password || !password_confirmation || !mobile || !place) {
                return res.status(400).json({ "status": "failed", "message": "All fields are required" });
            }
            if (password !== password_confirmation) {
                return res.status(400).json({ "status": "failed", "message": "Passwords does not match" });
            }
            if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])(.{5,})/.test(password)) {
                return res.status(400).json({ "status": "failed", "message": "Password must contain at least one capital letter, one special character, and be at least 5 characters long" });
            }
            const userWithEmail = await UserModel.findOne({ email: email });
            if (userWithEmail) {
                return res.status(400).json({ "status": "failed", "message": "Email already used" });
            }
            if (!/^\d{10}$/.test(mobile)) {
                return res.status(400).json({ "status": "failed", "message": "Mobile number must be 10 digits" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = new UserModel({
                name: name,
                email: email,
                password: hashPassword,
                mobile: mobile,
                place: place
            });
            await newUser.save();
            const saved_user = await UserModel.findOne({ email: email })
            const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
            res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })
        } catch (error) {
            return res.status(500).json({ "status": "error", "message": "Unable to register" });
        }
    }
    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await UserModel.findOne({ email: email });
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if ((user.email === email) && isMatch) {
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        res.send({ "status": "success", "message": "Login Success", "token": token })
                    } else {
                        return res.status(400).json({ "status": "failed", "message": "Email or Password is not valid" });
                    }
                } else {
                    return res.status(400).json({ "status": "failed", "message": "You are not a Registered User" });
                }
            } else {
                return res.status(400).json({ "status": "failed", "message": "All Fields are Required" });
            }
        } catch (error) {
            return res.status(500).json({ "status": "error", "message": "An error occurred while logging in" });
        }
    }
    static loggedUser = async (req, res) => {
        res.send({ "user": req.user })
    }
}
export default UserController;
