const NewsRoom = require("../models/newsRoom.model");

exports.createNewsRoom = async (req, res) => {
    try {
        const {title,url } = req.body;
        const emptyFields = [];
        if(!title) emptyFields.push("title");
        if(!url) emptyFields.push("url");
        if(emptyFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill the following fields: ${emptyFields.join(", ")}`
            })
        }
        const newsRoom = await NewsRoom.create({title,url});
        await newsRoom.save();
        return res.status(200).json({
            success: true,
            message: "NewsRoom created successfully",  
            data: newsRoom
        })
    } catch (error) {
        console.log("Internal server error",error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getAllNewsRooms = async (req, res) => {
    try {
        const newsRoom = await NewsRoom.find();
        if(!newsRoom) {
            return res.status(404).json({
                success: false,
                message: "No newsRoom found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "NewsRoom fetched successfully",
            data: newsRoom
        })
    } catch (error) {
        console.log("Internal server error",error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getSingleNewsRoom = async (req, res) => {
    try {
        const {id} = req.params;
        const newsRoom = await NewsRoom.findById(id);
        if(!newsRoom) {
            return res.status(404).json({
                success: false,
                message: "NewsRoom not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "NewsRoom fetched successfully",
            data: newsRoom
        })
    } catch (error) {
        console.log("Internal server error",error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteNewsRoom = async (req, res) => {
    try {
        const {id} = req.params;
        const newsRoom = await NewsRoom.findByIdAndDelete(id);
        if(!newsRoom) {
            return res.status(404).json({
                success: false,
                message: "NewsRoom not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "NewsRoom deleted successfully",
        })
    } catch (error) {
        console.log("Internal server error",error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updateNewsRoom = async (req, res) => {
    try {
        const {id} = req.params;
        const {title,url} = req.body;
        const exictingNewsRoom = await NewsRoom.findById(id);
        if(!exictingNewsRoom) {
            return res.status(404).json({
                success: false,
                message: "NewsRoom not found"
            })
        }

        if(title) exictingNewsRoom.title = title;
        if(url) exictingNewsRoom.url = url;
        await exictingNewsRoom.save();
        return res.status(200).json({
            success: true,
            message: "NewsRoom updated successfully",
            data: exictingNewsRoom
        })
    } catch (error) {
        console.log("Internal server error",error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}