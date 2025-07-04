import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js";
import sendEmail from "../utils/sendEmail.js";
import streamifier from "streamifier";
import crypto from "crypto";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

const uploadToCloudinary = (fileBuffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
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
        secure_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      },
    });

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
      } catch (err) {
        return next(new AppError("Failed to upload avatar", 500));
      }
    }

    await user.save();

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);
    res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide all fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ success: true, message: "User logged in successfully", user });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const logout = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({ success: true, message: "User logged out successfully" });
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, message: "User details", user });
  } catch (err) {
    return next(new AppError("Failed to fetch profile detail", 500));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new AppError("Please provide an email", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("Email not registered", 400));

  const resetToken = await user.generatePasswordResetToken();
  await user.save();

  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = "Reset Password";
  const message = `You can reset your password by clicking <a href="${resetPasswordURL}">here</a>.`;

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({ success: true, message: `Password reset link sent to ${email}` });
  } catch (e) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
    return next(new AppError(e.message, 500));
  }
};

const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  if (!token || !password) return next(new AppError("Token and password are required", 400));

  const forgotPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Invalid or expired token", 400));

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successfully" });
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return next(new AppError("Please provide all fields", 400));

  const user = await User.findById(req.user.id).select("+password");
  if (!user) return next(new AppError("User does not exist", 401));

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new AppError("Old password is incorrect", 400));

  user.password = newPassword;
  await user.save();
  user.password = undefined;

  res.status(200).json({ success: true, message: "Password changed successfully" });
};

const updateUser = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("User does not exist", 400));

  Object.keys(req.body).forEach((key) => {
    if (key !== "password") {
      user[key] = req.body[key];
    }
  });

  if (req.file) {
    await cloudinary.uploader.destroy(user.avatar.public_id);

    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.secure_url;
    } catch (err) {
      return next(new AppError("Failed to upload avatar", 500));
    }
  }

  await user.save();

  res.status(200).json({ success: true, message: "User profile updated successfully", user });
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
};