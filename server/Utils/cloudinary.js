const cloudinary = require("cloudinary").v2;
require('dotenv').config()
const fs = require('fs').promises;
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadSingleImage = async (filePath) => {
    try {
        // Ensure the file exists before upload
        await fs.access(filePath);
        
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "images",
        });
        try {
            await fs.unlink(filePath); // Delete local file
            console.log("Local file deleted:", filePath);
        } catch (unlinkError) {
            console.error("Error deleting local file:", unlinkError.message);
        }
        return { image: result.secure_url, public_id: result.public_id };
    } catch (error) {
        console.error('Error during image upload:', error.message);
        throw new Error('Failed to upload Image');
    }
};

const uploadFile = async (filePath) => {
    try {
        // Ensure the file exists
        await fs.access(filePath);

        const ext = path.extname(filePath).toLowerCase();
        if (!ext) {
            throw new Error("File does not have a valid extension");
        }

        let folder = "";
        let result;

        if (ext === ".pdf") {
            folder = "pdfs";
            result = await cloudinary.uploader.upload(filePath, {
                folder,
                resource_type: "raw",
            });
        } else if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].includes(ext)) {
            folder = "images";
            result = await cloudinary.uploader.upload(filePath, {
                folder,
            });
        } else {
            throw new Error("Unsupported file type");
        }

        // Delete local file after upload
        await fs.unlink(filePath);

        return {
            image: result.secure_url,
            public_id: result.public_id,
            folder,
        };
    } catch (error) {
        console.error("Error during file upload:", error.message);
        throw new Error("Failed to upload file");
    }
};

const uploadPDF = async (file) => {
    try {
        const pdf = await cloudinary.uploader.upload(file, {
            folder: 'images'
        })
        return { pdf: pdf.secure_url, public_id: pdf.public_id }
    } catch (error) {
        console.error(error)
        throw new Error('Failed to upload PDF');
    }
}

const deleteImage = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log("Image deleted successfully");
        return true;

    } catch (error) {
        console.log("Error deleting image:", error);
        throw new Error("Failed to delete image");
    }
}

const uploadMultipleImages = async (files) => {
    const uploadedImages = [];
    for (const filePath of files) {
        const result = await uploadSingleImage(filePath);
        uploadedImages.push(result);
    }
    return uploadedImages;
};


const deleteMultipleImages = async (public_ids) => {
    for (const public_id of public_ids) {
        await deleteImage(public_id);
    }
}

const deleteFile = async (publicId) => {
    try {
        // Use Cloudinary's destroy method for images or raw files
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto", // Automatically detects the resource type (image, raw, etc.)
        });

        if (result.result === "ok") {
            console.log("File successfully deleted from Cloudinary:", publicId);
            return { success: true, message: "File deleted successfully" };
        } else {
            throw new Error(result.result || "File deletion failed");
        }
    } catch (error) {
        console.error("Error during file deletion:", error.message);
        throw new Error("Failed to delete file");
    }
};

const deletePdfFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log('Image Deleted')
    } catch (error) {
        console.error('Error in deleting PDF from Cloudinary', error)
        throw new Error('Failed to delete Pdf fron the Cloudinary')
    }
}

module.exports = { uploadSingleImage, deletePdfFromCloudinary, uploadPDF, deleteImage, uploadMultipleImages, deleteMultipleImages, uploadFile, deleteFile };