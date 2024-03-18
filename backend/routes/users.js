var express = require('express');
var router = express.Router();
const { handleCreate, handleLogin,handleGetUser, handleUpdateProfile } = require("../controllers/users")
const authenticateToken = require('../middleware/authenticate');

router.post('/register', handleCreate);
router.post('/login', handleLogin);
// router.get('/list', authenticateToken, handleGetList);
router.get('/user/:id', authenticateToken, handleGetUser);
router.patch('/update-profile/:id', authenticateToken, handleUpdateProfile);
// router.patch('/update-profile', authenticateToken, handleUpdateProfile);

module.exports = router;
