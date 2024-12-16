const express = require('express');
const {protect} = require('../middleware/auth.js');
const { register, login, getProfile } = require('../controllers/authControllers.js');
const { getStatistics } = require('../controllers/taskControllers.js');

const router= express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/profile').post(protect,getProfile);


module.exports= router;