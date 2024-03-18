const userModel = require("../model/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/secretKey');
const apiResponse = require("../helpers/apiResponse");
const mongoose = require('mongoose');

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

module.exports =
{
  handleCreate,
  handleLogin,
  handleGetList,
  handleUpdateUserRoleAndStatus
}