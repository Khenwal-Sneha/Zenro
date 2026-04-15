const express = require('express');
const router = express.Router();

const asyncWrap = require('../utils/asyncWrap');
const listingController = require('../controllers/listing');
const { isLoggedin } = require('../isloggedin');

const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

/* ======================
   ALL LISTINGS
====================== */

// GET all listings
router.get('/', asyncWrap(listingController.index));

// CREATE listing
router.post(
  '/listings',
  isLoggedin,
  upload.single('image'),
  asyncWrap(listingController.create)
);

/* ======================
   SINGLE LISTING
====================== */

// SHOW
router.get('/listings/:id', asyncWrap(listingController.show));

// UPDATE
router.put(
  '/listings/:id',
  isLoggedin,
  upload.single('image'),
  asyncWrap(listingController.update)
);

// DELETE
router.delete(
  '/listings/:id',
  isLoggedin,
  asyncWrap(listingController.delete)
);

module.exports = router;