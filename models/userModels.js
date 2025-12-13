import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [6, "Password length should be greater than 6 characters"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    city: {
        type: String,
        required: [true, "City name is required"]
    },
    country: {
        type: String,
        required: [true, "Country is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    profilePic: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    role: {
        type: String,
        default: "User"
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;