var express = require('express');
var router = express.Router();
const { handleCreate, handleLogin,handleGetUser, handleUpdateProfile ,handleForgotPassword,handleResetPassword} = require("../controllers/users")
const authenticateToken = require('../middleware/authenticate');

router.post('/register', handleCreate);
router.post('/login', handleLogin);
router.get('/user/:id', authenticateToken, handleGetUser);
router.post('/update-profile/:id', authenticateToken, handleUpdateProfile);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password', handleResetPassword);

module.exports = router;
