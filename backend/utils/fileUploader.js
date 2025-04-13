const cloudinary = require("cloudinary").v2;

// Function to upload file to Cloudinary
exports.uploadFileToCloudinary = async (file, folder) => {
  try {
    console.log("Uploading file to Cloudinary:", {
      fileName: file.name,
      fileSize: file.size,
      folder
    });
    
    if (!file) {
      console.log("No file provided for upload");
      return null;
    }
    
    // Check if file is valid
    if (!file.tempFilePath) {
      console.error("Invalid file object - missing tempFilePath:", file);
      throw new Error("Invalid file object");
    }
    
    // Upload the file to cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: "auto"
    });
    
    console.log("Cloudinary upload successful:", {
      public_id: result.public_id,
      url: result.secure_url
    });
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error; // Rethrow to handle in controller
  }
}; 