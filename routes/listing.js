const express = require('express');
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap');
const Listing = require('../models/listing');
const { isLoggedin } = require('../isloggedin');
const listingController = require('../controllers/listing');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({storage});

router.route('/')
    // Index Route
    .get(asyncWrap(listingController.index))
    // Create Route
    .post(isLoggedin, upload.single('img'), asyncWrap(listingController.create));

router.route('/listings/new')
    // New Form
    .get(isLoggedin, listingController.newForm);

router.route('/listings/:id')
    // Show Route
    .get(asyncWrap(listingController.show))
    // Update Route
    .put(isLoggedin, upload.single('img'), asyncWrap(listingController.update))
    // Delete Route
    .delete(isLoggedin, asyncWrap(listingController.delete));

router.route('/listings/:id/edit')
    // Edit Route
    .get(isLoggedin, asyncWrap(listingController.edit));

module.exports = router;
