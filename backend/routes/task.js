var express = require('express');
var router = express.Router();
const { handleCreate, handleDelete, handleUpdate, handleGetList } = require("../controllers/task")
const authenticateToken = require('../middleware/authenticate');

router.post('', authenticateToken, handleCreate)
    .delete('/:id', authenticateToken, handleDelete)
    .patch('/:id', authenticateToken, handleUpdate)
    .get('', authenticateToken, handleGetList);

module.exports = router;
