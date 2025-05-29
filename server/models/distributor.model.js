const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const distributorSchema = new mongoose.Schema({
    distributorEntityName : {
        type : String,
    },
    constitutionEntity: {
        type : String,
    },
    address: {
        type : String,
    },
    city: {
        type : String,
    },
    state: {
        type : String,
    },
    pincode: {
        type : String,
    },
    location: {
        type : String,
    },
    gstNo: {
        type : String,
    },
    panNo: {
        type : String,
    },
    FSSAINo: {
        type : String,
    },
    ownerName: [{
        type : String,
    }],
    phoneNo: {
        type : Number,
        unique: true
    },
    alternatePhoneNo: {
        type : Number,
    },
    email: {
        type : String,
    },
    associatedCompany: {
        type : String,
    },
    coverageArea: [{
        type : String,
    }],
    coverageAreaDescription: [{
        type : String,
    }],
    startingYear: {
        type: Date,
        // required: true
    },
    numberOfCustomers: {
        type: Number,
        // required: true
    },
    godownArea: {
        type: Number,
        // required: true
    },
    noOfEmployees: {
        type: Number,
        // required: true
    },
    noOfVehicles: {
        type: Number,
        // required: true
    },
    typeOfVehicles: [{
        type: String,
        // required: true
    }],
    monthlyTurnOver: {
        type: Number,
        // required: true
    },
    channelsOfOperation: [{
        type: String,
        // required: true
    }],
    typesOfOperation: [{
        type: String,
        // required: true
    }],
    businessOperations: [{
        type: String,
        // required: true
    }],
    isERPUsed: {
        type: String,
        // required: true
    },
    distributorAssociationName: {
        type: String,
        // required: true
    },
    website: {
        type: String,
    },
    noOfRetailerOutlets: {
        type: Number,
    },
    customerFacilitiesProvided: [{
        type: String,
    }],
    associationRegisteredAs: [{
        type: String,
    }],
    nameOfHead: {
        type: String,
    },
    numberOfHead: {
        type: Number,
    },
    nameOfExecutiveHead: {
        type: String,
    },
    numberOfExecutiveHead: {
        type: Number,
    },
    memberOfAssociation: [{
        type: String,
    }],
    noOfAssociation:{
        type: Number,
    },
    noOfMember:{
        type: Number,
    },
    typeOfBusinessAssociation:[{
        type: String,
    }],
    officeAndGodownImage:[{
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    }],
    gstImage: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    fssaiImage: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    partner1Image: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    partner2Image: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    anyOtherDocImage: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    type: {
        type: String,
        enum: ['Distributor', 'Retailer', 'Association'],
    },
    Password: {
        type: String,
    },
    isDeactivated: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number
    },
    otpExpires: {
        type: Date
    },
    newPassword: {
        type: String
    },
    fileUploadedByAdmin: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    fileUploadedByDistributor: {
        url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    averageRating: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

distributorSchema.pre('save', async function (next) {
    if (!this.isModified('Password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

distributorSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.Password);
}

module.exports = mongoose.model("Distributor", distributorSchema);