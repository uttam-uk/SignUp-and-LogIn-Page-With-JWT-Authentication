import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    mobile: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (value) {
                return /^[0-9]{10}$/.test(value);
            },
            message: "Invalid mobile number format",
        },
    },
    place: { type: String, trim: true },
});
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
