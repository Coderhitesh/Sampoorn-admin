const Inquiry = require("../models/inquiry.model");

exports.createInquiry = async (req, res) => {
    
    try {
        const { name, email, phone, message } = req.body;
        const emptyFields = [];
        if (!name) emptyFields.push("name");
        if (!email) emptyFields.push("email");
        if (!phone) emptyFields.push("phone");
        if (!message) emptyFields.push("message");

        if (emptyFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill the following fields: ${emptyFields.join(", ")}`,
            })
        }

        const inquiry = await Inquiry.create({ name, email, phone, message });
        await inquiry.save();
        return res.status(200).json({
            success: true,
            message: "Inquiry created successfully",
            data: inquiry
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

exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({});
        if (!inquiries) {
            return res.status(404).json({
                success: false,
                message: "Inquiries not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Inquiries fetched successfully",
            data: inquiries
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

exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Inquiry deleted successfully",
            data: inquiry
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