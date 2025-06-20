import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import claudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const cookieOptions = {
    // expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    // secure: process.env.NODE_ENV === "production" ? true : false,
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return next(new AppError("Please provide all fields", 400));
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new AppError("Email already exists", 409));
        }

        const user = await User.create({
            fullName,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: "https://res.cloudinary.com/private-demo/image/upload/s--o1_ZfmFP--/c_crop,g_center,h_200,w_300/yellow_tulip.jpg",
            },
        });

        if (!user) {
            return next(new AppError("User registration failed, please try again", 400));
        }

      
                // console.log('File details >' , JSON.stringify(req.file));
        if(req.file) {
    
            
            try{
                const result = await claudinary.v2.uploader.upload(req.file.path, {
                    folder: "lms",
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill'
                });
                if(result){
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    // Remove file from server
                    fs.rm(`uploads/${req.file.filename}`);
                }
           
            } catch(err) {
                return next(
                    new AppError(err || "Failed to upload avatar, please try again", 500)
            );
            }
        }

            await user.save();

        user.password = undefined;

        const token = await user.generateJWTToken();

        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (err) {
        return next(new AppError(err.message, 400));
    }
};

const login = async (req,res,next)=>{
    try{
        const {email,password} = req.body;

    if(!email || !password){
        return next(new AppError("Please provide all fields", 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user || !(user.comparePassword(password))){
        return next(new AppError("Invalid email or password", 401));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user,
    });
    } catch(err){
       return next(new AppError(err.message, 500));
    }

};


const logout = (req,res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });

};
const getProfile = async (req,res)=>{
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json({
        success: true,
        message: "User details",
        user,
    })
    } catch(err){
        return next(new AppError('Failed to fetch profile detail', 500));
    }

};

const forgotPassword = async (req, res, next) => {
    // try {
        const { email } = req.body;

        if (!email) {
            return next(new AppError("Please provide an email", 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError("Email not registered", 400));
        }
        const resetToken = await user.generatePasswordResetToken();

        await user.save();

        const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const subject = "Reset Password";
        const message = `You can reset your password by clicking <a href="${resetPasswordURL}">here</a>. If you did not request this, please ignore this email.`;

        try {
            await sendEmail(email, subject,message);

            res.status(200).json({
                success: true,
                message: `Password reset link sent to ${email} successfully`,
            });
        } catch (e) {
            //  console.log("Nodemailer error:", e); 
            user.forgotPasswordToken = undefined;
            user.forgotPasswordExpiry = undefined;

            await user.save();
            return next(new AppError(e.message, 500));
        }

}

const resetPassword = async (req, res, next) => {
    // const {resetToken} = req.params;

    const {token, password } = req.body;

    if (!token || !password) {
        return next(new AppError("Token and password are required", 400));
    }

    const forgotPasswordToken = crypto
    
    .createHash("sha256")
    .update(token)
    .digest("hex");

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError("Invalid or expired password reset token, try again", 400));
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
}

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

        const {id} = req.user;

    if (!oldPassword || !newPassword) {
        return next(new AppError("Please provide all fields", 400));
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user ) {
        return next(new AppError("User does not exist", 401));
    }

    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
        return next(new AppError("Old password is incorrect", 400));
    }
    user.password = newPassword;
   
    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
}

const updateUser = async (req, res, next) => {
    // const { fullName } = req.body;

    // const {id} = req.user.id;

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new AppError("User does not exist", 400));
    }

    // if(req.fullName){
    //     user.fullName = fullName;
    // }
   
    // Update all fields from req.body (except password)
    Object.keys(req.body).forEach(key => {
        if (key !== "password") {
            user[key] = req.body[key];
        }
    });

    if (req.file) {

        await claudinary.v2.uploader.destroy(user.avatar.public_id);

        try {
            const result = await claudinary.v2.uploader.upload(req.file.path, {
                folder: "lms",
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });
            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                // Remove file from server
                fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (err) {
            return next(
                new AppError(err || "Failed to upload avatar, please try again", 500)
            );
        }
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        user,
    });
}

export {register,login,logout,getProfile, forgotPassword, resetPassword, changePassword, updateUser};