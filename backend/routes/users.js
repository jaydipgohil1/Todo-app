var express = require('express');
var router = express.Router();
const { handleCreate, handleLogin,handleGetUser, handleUpdateProfile ,handleForgotPassword} = require("../controllers/users")
const authenticateToken = require('../middleware/authenticate');

router.post('/register', handleCreate);
router.post('/login', handleLogin);
router.get('/user/:id', authenticateToken, handleGetUser);
router.post('/update-profile/:id', authenticateToken, handleUpdateProfile);
router.post('/forgot-password', handleForgotPassword);

module.exports = router;
