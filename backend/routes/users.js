var express = require('express');
var router = express.Router();
const { handleCreate, handleLogin, handleGetList, handleUpdateUserRoleAndStatus } = require("../controllers/users")
const authenticateToken = require('../middleware/authenticate');

router.post('/register', handleCreate);
router.post('/login', handleLogin);
router.get('/list', authenticateToken, handleGetList);
router.patch('/update/:id', authenticateToken, handleUpdateUserRoleAndStatus);

module.exports = router;
