import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        minLength:[5, "Full name must be at least 5 characters"],
        maxLength: [50, "Full name must be at most 50 characters"],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        unique: true,

        match:[/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_'+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
                 "Please enter a valid email address",  ]

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false,
    },

    avatar:{
        public_id: {
            type: String,
           
        },
        secure_url: {
            type: String,
         
        }
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
        id: String,
        status: String
    }
   
},{
    timestamps: true
});

userSchema.pre("save",async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods = {
        generateJWTToken: async function() {
            return jwt.sign( 
                {id: this._id, email: this.email, subscription: this.subscription, role: this.role}, 
                process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRY,
            });
        },
        comparePassword: async function(enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
        },
        generatePasswordResetToken: async function() {
            const resetToken = crypto.randomBytes(20).toString("hex");

            this.forgotPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex")
            ;
            this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now
            return resetToken;
        }
}

const User = model("User", userSchema);
export default User;