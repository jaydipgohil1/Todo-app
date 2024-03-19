const userModel = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/secretKey");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { generateToken, decodeToken } = require("../middleware/utils"); //

const nodemailer = require("nodemailer");
const crypto = require("crypto");

async function handleCreate(req, res) {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return apiResponse.validationErrorWithData(res, "Email already exists.", {
        success: false,
      });
      // res.status(422).json({ error: 'Email already exists', code: 200, success: false, });
    } else {
      const user = new userModel(req.body);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;

      let result = await user.save();
      result = result.toObject();
      delete result.password;
      return apiResponse.successResponseWithData(
        res,
        "Registration Success.",
        result
      );
      // res.status(200).json({ data: result, code: 200, success: true });
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, {
      success: false,
    });
    // res.status(400).send({ error: error, success: false });
  }
}

async function handleLogin(req, res) {
  if (req.body.email && req.body.password) {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const isMatch = await comparePassword(req.body.password, user.password);
      if (!isMatch)
        return apiResponse.unauthorizedResponse(
          res,
          "Invalid Email or Password"
        );
      // res.status(401).json({ error: 'Invalid Email or Password', code: 200, success: false, });

      let result = user.toObject();
      delete result.password;
      result.token = jwt.sign(result, secret, { expiresIn: "24h" });
      return apiResponse.successResponseWithData(res, "Login Success.", result);
      // res.status(200).json({ token: token, code: 200, success: true });
    } else return apiResponse.notFoundResponse(res, "User not Exist");
    // res.status(401).json({ error: 'User not Exist', code: 200, success: false });
  } else {
    return apiResponse.validationErrorWithData(
      res,
      "Email or Password not provided.",
      "Invalid Data"
    );
    // res.status(200).json({ error: 'Email or Password not provided', code: 200, success: false });
  }
}

// Compare password with hashed password in database
function comparePassword(reqPassword, userPassword) {
  return bcrypt.compare(reqPassword, userPassword);
}

async function handleGetList(req, res) {
  try {
    let users = await userModel.find({}).select("-password");
    apiResponse.successResponseWithData(res, "fetch users Success.", users);
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, {
      success: false,
    });
  }
}
async function handleGetUser(req, res) {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    let users = await userModel.findOne({ _id: objectId }).select("-password");
    apiResponse.successResponseWithData(res, "fetch users Success.", users);
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, {
      success: false,
    });
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads/"); // Specify the upload path here
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Use the current timestamp as the filename
    },
  }),
  limits: { fileSize: 5000000 },
}).single("file"); // Assuming the field name for the file is 'avatar'

async function handleUpdateProfile(req, res) {
  try {
    // Call Multer middleware to handle file upload
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      // If file is uploaded successfully, proceed with updating the user profile
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      const updateFields = req.body;

      // If file is uploaded, update the avatar field in the updateFields object
      if (req.file) {
        updateFields.file = req.file.path; // Assuming you want to save the file path in the database
      }

      // Add updated_at field
      updateFields.updated_at = new Date();

      const result = await userModel.updateOne(
        { _id: objectId },
        { $set: updateFields }
      );

      if (result.modifiedCount && result.acknowledged) {
        return apiResponse.successResponseWithData(
          res,
          "User Update Success.",
          result
        );
      } else {
        return apiResponse.validationErrorWithData(res, "No User Update", {
          success: false,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function handleForgotPassword(req, res) {
  const { email } = req.body;

  // Step 2: Generate Reset Token
  const resetToken = generateToken(email);

  try {
    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Set reset token and expiry time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // Step 3: Send Reset Email
    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io", // SMTP server host
      port: 587, // SMTP port (typically 587 for TLS or 465 for SSL)
      secure: false, // Set to true if using SSL (port 465)
      auth: {
        user: "api", // Your email address
        pass: "", // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: "hi@demomailtrap.com",
      to: email,
      subject: "Password Reset Request",
      text:
        `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${req.headers.origin}/reset-password/${resetToken}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // return res.status(200).json({ resetToken: `${req.headers.origin}/reset-password/${resetToken}` });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send reset email." });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ message: "Reset email sent successfully." });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
}

async function handleResetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    // Decode token to get email
    // const decoded = jwt.verify(token, secret);
    // const email = decoded.email;
    const email = decodeToken(token);
    console.log(email);
    // Find user by email
    const user = await userModel.findOne({ email:email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    // Update user's password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  handleCreate,
  handleLogin,
  handleGetList,
  handleUpdateProfile,
  handleGetUser,
  handleForgotPassword,
  handleResetPassword,
};
