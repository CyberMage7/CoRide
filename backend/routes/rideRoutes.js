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

// Debug route to safely check ride data
router.get('/debug/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Debug: Fetching ride with ID:", id);
    
    // Basic validation
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        details: { id }
      });
    }
    
    const Ride = require('../models/Ride');
    // Find ride without populating references first
    const ride = await Ride.findById(id);
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }
    
    // Return safe data
    return res.status(200).json({
      success: true,
      message: 'Debug info',
      basic: {
        id: ride._id,
        rideType: ride.rideType,
        status: ride.status,
        userId: ride.userId,
        hasMatchedWith: ride.matchedWith ? ride.matchedWith.length > 0 : false
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Debug error',
      error: error.message,
      stack: error.stack
    });
  }
});

// Update ride consent
router.post('/consent', updateRideConsent);

// Cancel ride
router.delete('/:rideId', cancelRide);

module.exports = router; 