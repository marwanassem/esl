const express = require('express');

const router = express.Router();

const courseController = require('../controllers/course');
const { body } = require('express-validator/check');
const Course = require('../models/course');

router.get('/courses', courseController.getCourses);