const express = require('express');
const router = express.Router();
const { 
  createRide, 
  getUserRides, 
  getRideById, 
  updateRideConsent,
  cancelRide
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Create a new ride and get user rides
router.route('/')
  .post(createRide)
  .get(getUserRides);

// Get specific ride by ID
router.route('/:id')
  .get(getRideById);

// Update ride consent
router.post('/consent', updateRideConsent);

// Cancel ride
router.delete('/:rideId', cancelRide);

module.exports = router; 