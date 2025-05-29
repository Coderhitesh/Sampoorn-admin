const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);