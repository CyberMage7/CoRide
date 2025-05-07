const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rideType: { 
    type: String, 
    enum: ['private', 'shared'], 
    required: true 
  },
  source: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  pickupTime: { 
    type: Date, 
    required: true 
  },
  bookingTime: { 
    type: Date, 
    default: Date.now 
  },
  isPreBooked: { 
    type: Boolean, 
    default: true 
  },
  status: { 
    type: String, 
    enum: ['waiting', 'confirmed', 'private', 'completed', 'cancelled'], 
    default: 'waiting' 
  },
  matchedWith: [{ 
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    source: {
      type: String
    },
    sourceCoordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  }],
  consentStatus: { 
    type: Map, 
    of: { 
      type: String, 
      enum: ['pending', 'accepted', 'declined'] 
    } 
  },
  sourceCoordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  destinationCoordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  fare: {
    type: Number
  },
  originalFare: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ride', rideSchema); 