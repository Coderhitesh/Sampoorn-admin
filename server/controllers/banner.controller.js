const Banner = require("../models/banner.model");
const { uploadSingleImage, deleteImage } = require("../Utils/cloudinary");

exports.createBanner = async (req, res) => {
    const uploadedImages = [];
    try {
        const banner = await Banner.create({})
        if (req.file) {
            try {
                const imgURL = await uploadSingleImage(req.file.path)
                const { image, public_id } = imgURL;
                uploadedImages.push(public_id);
                banner.image.url = image;
                banner.image.public_id = public_id;
            } catch (error) {
                console.log("Internal server error", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error: error.message
                })
            }
        }

        await banner.save();
        res.status(200).json({
            success: true,
            message: "Banner created successfully",
            data: banner
        })

    } catch (error) {
        console.log("Internal server error", error);
        if (uploadedImages.length > 0) {
            await deleteImage(uploadedImages);
        }
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({});
        if (!banners) {
            return res.status(404).json({
                success: false,
                message: "Banners not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Banners fetched successfully",
            data: banners
        })
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getSingleBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Banner fetched successfully",
            data: banner
        })
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
            data: banner
        })
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updateBannerStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const banner = await Banner.findById(id);
        const {isActive} = req.body;
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            })
        }
        banner.isActive = isActive;
        await banner.save();
        return res.status(200).json({
            success: true,
            message: "Banner status updated successfully",
            data: banner
        })
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updatebanner = async (req,res) => {
    const uploadedImages = [];
    try {
        const {id} = req.params;
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            })
        }
        if (req.file) {
            try {
                if (banner?.image?.public_id) {
                    await deleteImage(banner.image.public_id);
                }
                const imgURL = await uploadSingleImage(req.file.path)
                const { image, public_id } = imgURL;
                banner.image.url = image;
                banner.image.public_id = public_id;
                uploadedImages.push(public_id);
            } catch (error) {
                console.log("Internal server error", error);
                if (uploadedImages.length > 0) {
                    await deleteImage(uploadedImages);
                }
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error: error.message
                })
            }
        }
        await banner.save();
        return res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: banner
        })
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}