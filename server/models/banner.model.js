const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Banner", bannerSchema);