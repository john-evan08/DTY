const express = require ('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database')

const User = require('../../models/user');
require('../../config/passport')(passport);

module.exports = router;
