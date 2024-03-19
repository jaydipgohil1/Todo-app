const Task = require("../model/Task");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");

async function handleCreate(req, res) {
  try {
    if (req.body.title) {
      const existingTask = await Task.findOne({
        title: req.body.title,
      });

      if (existingTask)
        return apiResponse.validationErrorWithData(
          res,
          "Task already exists.",
          { success: false }
        );
      else {
        req.body.user_id = req.user._id;
        const newTask = new Task(req.body);
        let result = await newTask.save();
        result = result.toObject();
        return apiResponse.successResponseWithData(
          res,
          "Task created successfully.",
          result
        );
      }
    } else
      return apiResponse.validationErrorWithData(
        res,
        "All data not provided, please provide necessary data",
        "Invalid Data"
      );
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, {
      success: false,
    });
  }
}

async function handleDelete(req, res) {
  try {
    if (req.params.id) {
      const result = await Task.deleteOne({ _id: req.params.id });

      if (!result.deletedCount)
        return apiResponse.validationErrorWithData(
          res,
          "Task not found or Error occurred while deleting Task.",
          { success: false }
        );
      return apiResponse.successResponseWithData(
        res,
        "Task deleted successfully.",
        result
      );
    } else
      return apiResponse.validationErrorWithData(
        res,
        "Task ID not provided.",
        "Invalid Data"
      );
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, {
      success: false,
    });
  }
}

async function handleUpdate(req, res) {
  try {
    if (req.params.id) {
      const objectId = new mongoose.Types.ObjectId(req.params.id);
      req.body.updated_at = new Date();
      const result = await Task.updateOne(
        { _id: objectId },
        { $set: req.body }
      );
      if (result.modifiedCount)
        return apiResponse.successResponseWithData(
          res,
          "Task Update Success.",
          result
        );
      else
        return apiResponse.validationErrorWithData(
          res,
          "Task not found or Error occurred while updating Task.",
          { success: false }
        );
    } else
      return apiResponse.validationErrorWithData(
        res,
        "Task ID not provided.",
        "Invalid Data"
      );
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      return apiResponse.validationErrorWithData(
        res,
        "Task with this title already exists.",
        { success: false }
      );
    } else {
      return apiResponse.validationErrorWithData(res, error.message, {
        success: false,
      });
    }
  }
}

async function handleGetList(req, res) {
  try {
    let tasks = await Task.find({ user_id: req.user._id }).sort({ date: 1 });

    apiResponse.successResponseWithData(res, "Fetch Task Success.", tasks);
  } catch (error) {
    return apiResponse.validationErrorWithData(res, error.message, {
      success: false,
    });
  }
}

module.exports = {
  handleCreate,
  handleDelete,
  handleUpdate,
  handleGetList,
};
