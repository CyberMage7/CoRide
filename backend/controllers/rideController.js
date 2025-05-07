const Ride = require('../models/Ride');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new ride
exports.createRide = async (req, res) => {
  try {
    const { 
      source, 
      destination, 
      rideType, 
      pickupTime, 
      sourceCoordinates,
      destinationCoordinates,
      fare
    } = req.body;

    // Validate required fields
    if (!source || !destination || !rideType || !pickupTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create base ride object
    const rideData = {
      userId: req.user.id,
      source,
      destination,
      rideType,
      pickupTime: new Date(pickupTime),
      bookingTime: new Date(),
      isPreBooked: true,
      sourceCoordinates,
      destinationCoordinates,
      fare
    };

    // Handle based on ride type
    if (rideType === 'private') {
      // For private rides, set status directly to 'private'
      rideData.status = 'private';
      
      const ride = await Ride.create(rideData);
      
      return res.status(201).json({
        success: true,
        message: 'Private ride created successfully',
        data: ride
      });
    } else if (rideType === 'shared') {
      // For shared rides, try to find a match
      // Calculate time window (±15 minutes)
      const pickupTimeObj = new Date(pickupTime);
      const fifteenMinutes = 15 * 60 * 1000;
      const lowerTimeLimit = new Date(pickupTimeObj.getTime() - fifteenMinutes);
      const upperTimeLimit = new Date(pickupTimeObj.getTime() + fifteenMinutes);

      // Find matching rides
      const matchingRide = await Ride.findOne({
        destination,
        rideType: 'shared',
        status: 'waiting',
        pickupTime: { $gte: lowerTimeLimit, $lte: upperTimeLimit },
        userId: { $ne: req.user.id } // Ensure it's not the user's own ride
      });

      if (matchingRide) {
        // Found a matching ride - add current user with their source location
        matchingRide.matchedWith.push({
          userId: req.user.id,
          source: source,
          sourceCoordinates: sourceCoordinates
        });
        
        // Initialize consent status as pending
        if (!matchingRide.consentStatus) {
          matchingRide.consentStatus = new Map();
        }
        
        // Set consent status for original user (if not already set)
        if (!matchingRide.consentStatus.has(matchingRide.userId.toString())) {
          matchingRide.consentStatus.set(matchingRide.userId.toString(), 'pending');
        }
        
        // Set consent status for current user
        matchingRide.consentStatus.set(req.user.id, 'pending');
        
        await matchingRide.save();
        
        // TODO: Send notification to matched users about match

        return res.status(200).json({
          success: true,
          message: 'Found matching shared ride',
          data: matchingRide
        });
      } else {
        // No matching ride found - create new ride with waiting status
        rideData.status = 'waiting';
        
        // Initialize empty consentStatus map
        rideData.consentStatus = new Map();
        rideData.matchedWith = [];
        
        const ride = await Ride.create(rideData);
        
        return res.status(201).json({
          success: true,
          message: 'Created new shared ride in waiting status',
          data: ride
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride type'
      });
    }
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create ride',
      error: error.message
    });
  }
};

// Get user's rides
exports.getUserRides = async (req, res) => {
  try {
    // Find rides where user is either creator or matched
    const rides = await Ride.find({
      $or: [
        { userId: req.user.id },
        { 'matchedWith.userId': req.user.id }
      ]
    }).sort({ pickupTime: -1 });
    
    return res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    console.error('Get user rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rides',
      error: error.message
    });
  }
};

// Get ride by ID
exports.getRideById = async (req, res) => {
  try {
    // Get the ride ID from params
    const { id } = req.params;
    
    // Log detailed information for debugging
    console.log('Ride ID received:', id);
    console.log('User ID making request:', req.user.id);
    
    // Validate the ID format using a try-catch
    try {
      // Check if valid MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ObjectId format:', id);
        return res.status(400).json({
          success: false,
          message: 'Invalid ride ID format'
        });
      }
    } catch (validationError) {
      console.error('ID validation error:', validationError);
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }
    
    // First try to get the ride without populating
    let basicRide;
    try {
      basicRide = await Ride.findById(id);
      
      if (!basicRide) {
        console.log('Ride not found in database:', id);
        return res.status(404).json({
          success: false,
          message: 'Ride not found'
        });
      }
      
      console.log('Basic ride found:', basicRide._id.toString());
    } catch (findError) {
      console.error('Error finding ride:', findError);
      return res.status(500).json({
        success: false,
        message: 'Database error while finding ride',
        error: findError.message
      });
    }
    
    // Now check authorization before populating
    let isAuthorized = false;
    
    // Check if user is the owner
    if (basicRide.userId && basicRide.userId.toString() === req.user.id) {
      isAuthorized = true;
      console.log('User is the ride owner');
    }
    
    // Check if user is in matchedWith array
    if (!isAuthorized && basicRide.matchedWith && Array.isArray(basicRide.matchedWith)) {
      isAuthorized = basicRide.matchedWith.some(match => 
        match.userId && match.userId.toString() === req.user.id
      );
      
      if (isAuthorized) {
        console.log('User is in matchedWith array');
      }
    }
    
    if (!isAuthorized) {
      console.log('User not authorized to view this ride');
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this ride'
      });
    }
    
    // Now get the populated ride with references
    try {
      const populatedRide = await Ride.findById(id)
        .populate('userId', 'name email collegeName')
        .populate('matchedWith.userId', 'name email collegeName');
      
      return res.status(200).json({
        success: true,
        data: populatedRide
      });
    } catch (populateError) {
      console.error('Error populating ride:', populateError);
      
      // If population fails, return the basic ride instead
      return res.status(200).json({
        success: true,
        data: basicRide,
        note: 'Unable to load related user details'
      });
    }
  } catch (error) {
    console.error('General error in getRideById:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching ride',
      error: error.message
    });
  }
};

// Update ride consent
exports.updateRideConsent = async (req, res) => {
  try {
    const { rideId, consent } = req.body;
    
    if (!rideId || !consent) {
      return res.status(400).json({
        success: false,
        message: 'Missing ride ID or consent status'
      });
    }
    
    if (!['accepted', 'declined'].includes(consent)) {
      return res.status(400).json({
        success: false,
        message: 'Consent must be either accepted or declined'
      });
    }
    
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }
    
    // Check if user is part of this ride
    const isCreator = ride.userId.toString() === req.user.id;
    const isMatched = ride.matchedWith.some(match => match.userId.toString() === req.user.id);
    const isUserRide = isCreator || isMatched;
    
    if (!isUserRide) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this ride'
      });
    }
    
    // Update consent status for this user
    if (!ride.consentStatus) {
      ride.consentStatus = new Map();
    }
    
    ride.consentStatus.set(req.user.id, consent);
    
    // If consent declined, handle accordingly
    if (consent === 'declined') {
      // If ride creator declined, keep all other users in the ride
      if (isCreator) {
        // Create a new ride for the original user with private status
        const newRide = new Ride({
          userId: req.user.id,
          source: ride.source,
          destination: ride.destination,
          rideType: 'private',
          pickupTime: ride.pickupTime,
          bookingTime: ride.bookingTime,
          isPreBooked: true,
          status: 'private',
          sourceCoordinates: ride.sourceCoordinates,
          destinationCoordinates: ride.destinationCoordinates,
          fare: ride.fare
        });
        
        await newRide.save();
        
        // If there's only one matched user, convert their ride to private
        if (ride.matchedWith.length === 1) {
          const matchedUserData = ride.matchedWith[0];
          ride.userId = matchedUserData.userId;
          ride.source = matchedUserData.source;
          ride.sourceCoordinates = matchedUserData.sourceCoordinates;
          ride.matchedWith = [];
          ride.consentStatus = new Map();
          ride.rideType = 'private';
          ride.status = 'private';
        } else {
          // If there are multiple matched users, first matched user becomes the ride owner
          const newOwnerData = ride.matchedWith[0];
          ride.userId = newOwnerData.userId;
          ride.source = newOwnerData.source;
          ride.sourceCoordinates = newOwnerData.sourceCoordinates;
          ride.matchedWith = ride.matchedWith.slice(1); // Remove the new owner from matched users
        }
      } else {
        // If matched user declined, just remove them from the ride
        ride.matchedWith = ride.matchedWith.filter(
          match => match.userId.toString() !== req.user.id
        );
        ride.consentStatus.delete(req.user.id);
        
        // Get user's source location from matchedWith before removing
        const userMatchData = ride.matchedWith.find(match => match.userId.toString() === req.user.id);
        
        // Create a new private ride for the declining user
        const newRide = new Ride({
          userId: req.user.id,
          source: userMatchData ? userMatchData.source : ride.source,
          destination: ride.destination,
          rideType: 'private',
          pickupTime: ride.pickupTime,
          bookingTime: ride.bookingTime,
          isPreBooked: true,
          status: 'private',
          sourceCoordinates: userMatchData ? userMatchData.sourceCoordinates : ride.sourceCoordinates,
          destinationCoordinates: ride.destinationCoordinates,
          fare: ride.fare
        });
        
        await newRide.save();
        
        // If no more matched users, convert the original ride to private
        if (ride.matchedWith.length === 0) {
          ride.rideType = 'private';
          ride.status = 'private';
          ride.consentStatus = new Map();
        }
      }
    } else if (consent === 'accepted') {
      // Check if all users have accepted
      let allAccepted = true;
      
      // Check original user
      if (ride.consentStatus.get(ride.userId.toString()) !== 'accepted') {
        allAccepted = false;
      }
      
      // Check all matched users
      for (const matchedUser of ride.matchedWith) {
        if (ride.consentStatus.get(matchedUser.userId.toString()) !== 'accepted') {
          allAccepted = false;
          break;
        }
      }
      
      // If all accepted, update ride status to confirmed and reduce fare by half
      if (allAccepted) {
        ride.status = 'confirmed';
        // Store original fare if not already stored
        if (!ride.originalFare) {
          ride.originalFare = ride.fare;
        }
        // Reduce fare by half
        ride.fare = Math.round(ride.originalFare / 2);
      }
    }
    
    await ride.save();
    
    return res.status(200).json({
      success: true,
      message: `Ride consent updated to ${consent}`,
      data: ride
    });
  } catch (error) {
    console.error('Update ride consent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ride consent',
      error: error.message
    });
  }
};

// Cancel ride
exports.cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }
    
    // Check if user is owner of this ride
    if (ride.userId.toString() !== req.user.id) {
      // Also check if user is in matchedWith (for shared rides)
      const isMatched = ride.matchedWith.some(match => match.userId.toString() === req.user.id);
      
      if (!isMatched) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to cancel this ride'
        });
      }
      
      // If user is matched but not the owner, just remove them from the ride
      ride.matchedWith = ride.matchedWith.filter(match => match.userId.toString() !== req.user.id);
      ride.consentStatus.delete(req.user.id);
      
      // If no more matched users and ride was shared, convert to private
      if (ride.rideType === 'shared' && ride.matchedWith.length === 0) {
        ride.rideType = 'private';
        ride.status = 'private';
      }
      
      await ride.save();
      
      return res.status(200).json({
        success: true,
        message: 'You have been removed from this shared ride'
      });
    }
    
    // If user is the owner
    // For shared rides with matches, transfer ownership to first matched user
    if (ride.rideType === 'shared' && ride.matchedWith.length > 0) {
      const newOwnerData = ride.matchedWith[0];
      const newRide = new Ride({
        userId: ride.userId, // Keep the original owner
        source: ride.source,
        destination: ride.destination,
        rideType: 'private',
        pickupTime: ride.pickupTime,
        bookingTime: ride.bookingTime,
        isPreBooked: ride.isPreBooked,
        status: 'cancelled',
        sourceCoordinates: ride.sourceCoordinates,
        destinationCoordinates: ride.destinationCoordinates,
        fare: ride.fare
      });
      
      await newRide.save();
      
      // Update the original ride with the new owner
      ride.userId = newOwnerData.userId;
      ride.source = newOwnerData.source;
      ride.sourceCoordinates = newOwnerData.sourceCoordinates;
      ride.matchedWith = ride.matchedWith.slice(1); // Remove new owner from matches
      
      // If no more matches, convert to private
      if (ride.matchedWith.length === 0) {
        ride.rideType = 'private';
        ride.status = 'private';
      }
      
      await ride.save();
      
      return res.status(200).json({
        success: true,
        message: 'Ride cancelled and ownership transferred'
      });
    } else {
      // For private rides or shared rides with no matches, just cancel
      ride.status = 'cancelled';
      await ride.save();
      
      return res.status(200).json({
        success: true,
        message: 'Ride cancelled successfully'
      });
    }
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel ride',
      error: error.message
    });
  }
};