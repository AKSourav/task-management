const express = require('express');
const {protect} = require('../middleware/auth.js');
const {createTask, getTasks, deleteTask, updateTask, getStatistics} = require('../controllers/taskControllers.js');

const router= express.Router();

router.route('/').post(protect,createTask).get(protect,getTasks)
router.route('/:taskId').delete(protect,deleteTask);
router.route('/:taskId').patch(protect,updateTask).put(protect, updateTask);
router.route('/stats').get(protect,getStatistics);

module.exports= router;