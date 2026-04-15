const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap");
const reviewController = require("../controllers/review");
const { isLoggedin } = require("../isloggedin");

// ADD REVIEW
router.post('/', isLoggedin, asyncWrap(reviewController.add));

// DELETE REVIEW
router.delete('/:id2', isLoggedin, asyncWrap(reviewController.delete));

module.exports = router;