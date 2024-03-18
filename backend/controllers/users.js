const userModel = require("../model/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/secretKey');
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');
const multer = require('multer');

async function handleCreate(req, res) {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return apiResponse.validationErrorWithData(res, "Email already exists.", { success: false });
      // res.status(422).json({ error: 'Email already exists', code: 200, success: false, });
    } else {
      const user = new userModel(req.body)
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;

      let result = await user.save()
      result = result.toObject();
      delete result.password;
      return apiResponse.successResponseWithData(res, "Registration Success.", result);
      // res.status(200).json({ data: result, code: 200, success: true });
    }
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
    // res.status(400).send({ error: error, success: false });
  }

}

async function handleLogin(req, res) {
  if (req.body.email && req.body.password) {
    const user = await userModel.findOne({ email: req.body.email })
    if (user) {
      const isMatch = await comparePassword(req.body.password, user.password);
      if (!isMatch) return apiResponse.unauthorizedResponse(res, "Invalid Email or Password");
      // res.status(401).json({ error: 'Invalid Email or Password', code: 200, success: false, });

      let result = user.toObject();
      delete result.password;
      result.token = jwt.sign(result, secret, { expiresIn: '24h' });
      return apiResponse.successResponseWithData(res, "Login Success.", result);
      // res.status(200).json({ token: token, code: 200, success: true });
    } else
      return apiResponse.notFoundResponse(res, "User not Exist");
    // res.status(401).json({ error: 'User not Exist', code: 200, success: false });
  }
  else {
    return apiResponse.validationErrorWithData(res, "Email or Password not provided.", "Invalid Data");
    // res.status(200).json({ error: 'Email or Password not provided', code: 200, success: false });
  }
}

// Compare password with hashed password in database
function comparePassword(reqPassword, userPassword) {
  return bcrypt.compare(reqPassword, userPassword);
}

async function handleGetList(req, res) {
  try {
    let users = await userModel.find({}).select('-password');
    apiResponse.successResponseWithData(res, "fetch users Success.", users);
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}
async function handleGetUser(req, res) {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    let users = await userModel.find({   '_id': objectId }).select('-password');
    apiResponse.successResponseWithData(res, "fetch users Success.", users);
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}

async function handleUpdateUserRoleAndStatus(req, res) {
  try {
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    req.body.updated_at = new Date();
    const result = await userModel.updateOne(
      { '_id': objectId },
      { $set: req.body }
    );
    if (result.modifiedCount && result.acknowledged) {
      return apiResponse.successResponseWithData(res, "User Update Success.", result);
    }
    else return apiResponse.validationErrorWithData(res, "No User Update", { success: false });
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, { success: false });
  }
}


// Multer configuration for file upload
// Multer configuration for file upload
const upload = multer({ 
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the upload path here
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Use the current timestamp as the filename
    }
  })
}).single('avatar'); // Assuming the field name for the file is 'avatar'

async function handleUpdateProfile(req, res) {
  try {
    // Call Multer middleware to handle file upload
    // upload(req, res, async function (err) {
    //   if (err instanceof multer.MulterError) {
    //     return res.status(400).json({ success: false, message: err.message });
    //   } else if (err) {
    //     return res.status(500).json({ success: false, message: err.message });
    //   }
    //   // If file is uploaded successfully, proceed with updating the user profile
    //   const objectId = new mongoose.Types.ObjectId(req.params.id);
    //   const updateFields = req.body;

    //   // If file is uploaded, update the avatar field in the updateFields object
    //   if (req.file) {
    //     updateFields.avatar = req.file.path; // Assuming you want to save the file path in the database
    //   }

    // });
    // Add updated_at field
    const objectId = new mongoose.Types.ObjectId((req.params.id).toString());
    req.body.updated_at = new Date();
    console.log(objectId);
    const result = await userModel.updateOne(
      { '_id': objectId },
      { $set: req.body }
    );
    if (result.modifiedCount && result.acknowledged) {
      return apiResponse.successResponseWithData(res, "User Update Success.", result);
    }
    else return apiResponse.validationErrorWithData(res, "No User Update", { success: false });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports =
{
  handleCreate,
  handleLogin,
  handleGetList,
  handleUpdateProfile,
  handleGetUser
}