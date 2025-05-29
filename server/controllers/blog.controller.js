const Blog = require("../models/blog.model");
const { uploadSingleImage, deleteImage } = require("../Utils/cloudinary");

exports.createBlog = async (req, res) => {
    try {
        const {title,author,content,} = req.body;
        const emptyFields = [];
        if (!title) emptyFields.push("title");
        if (!author) emptyFields.push("author");
        if (!content) emptyFields.push("content");
        if (emptyFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill the following fields: ${emptyFields.join(", ")}`,
            })
        }
        const blog = await Blog.create({ title, author, content });
        if(req.file){
            const imgUrl = await uploadSingleImage(req.file.path);
            const { image, public_id } = imgUrl;
            blog.image.url = image;
            blog.image.public_id = public_id;
        }
        await blog.save();
        return res.status(200).json({
            success: true,
            message: "Blog created successfully",
            data: blog
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

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        if(!blogs){
            return res.status(404).json({
                success: false,
                message: "Blogs not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            data: blogs
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

exports.getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog
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

exports.updateBlog = async (req, res) => {
    try {
        const {title,author,content,} = req.body;
        const emptyFields = [];
        if (!title) emptyFields.push("title");
        if (!author) emptyFields.push("author");
        if (!content) emptyFields.push("content");
        if (emptyFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Please fill the following fields: ${emptyFields.join(", ")}`,
            })
        }
        const blog = await Blog.findByIdAndUpdate(req.params.id);
        if(!blog){
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            })
        }
        blog.title = title;
        blog.author = author;
        blog.content = content;
        if(req.file){
            if(blog?.image?.public_id){
                await deleteImage(blog.image.public_id);
            }
            const imgUrl = await uploadSingleImage(req.file.path);
            const { image, public_id } = imgUrl;
            blog.image.url = image;
            blog.image.public_id = public_id;
        }
        await blog.save();
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog
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

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if(!blog){
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            })
        }
        if(blog?.image?.public_id){
            await deleteImage(blog.image.public_id);
        }
        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
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