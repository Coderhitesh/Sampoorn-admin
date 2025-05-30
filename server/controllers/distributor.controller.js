const Distributor = require("../models/distributor.model");
const { uploadMultipleImages, uploadSingleImage, uploadFile, deleteImage, deleteMultipleImages, uploadPDF, deletePdfFromCloudinary } = require("../Utils/cloudinary");
const sendToken = require("../Utils/SendToken");
const SendEmail = require("../Utils/SendEmail")

exports.createDistributor = async (req, res) => {
    const uploadedImages = [];
    try {
        console.log("=== CREATE DISTRIBUTOR REQUEST ===");
        console.log("Request Body:", req.body);
        console.log("Request Files:", req.files);
        console.log("Files Array Length:", req.files ? req.files.length : 0);

        const {
            distributorEntityName,
            constitutionEntity,
            address,
            city,
            state,
            pincode,
            location,
            gstNo,
            panNo,
            FSSAINo,
            ownerName,
            phoneNo,
            alternatePhoneNo,
            email,
            associatedCompany,
            coverageArea,
            coverageAreaDescription,
            startingYear,
            numberOfCustomers,
            godownArea,
            noOfEmployees,
            noOfVehicles,
            typeOfVehicles,
            monthlyTurnOver,
            channelsOfOperation,
            typesOfOperation,
            businessOperations,
            website,
            noOfRetailerOutlets,
            customerFacilitiesProvided,
            associationRegisteredAs,
            nameOfHead,
            numberOfHead,
            nameOfExecutiveHead,
            numberOfExecutiveHead,
            memberOfAssociation,
            noOfAssociation,
            isERPUsed,
            distributorAssociationName,
            typeOfBusinessAssociation,
            noOfMember,
            type,
            Password
        } = req.body;

        console.log("Extracted phoneNo:", phoneNo);
        console.log("Extracted type:", type);
        console.log("Extracted Password:", Password);

        const emptyFields = [];
        if (!phoneNo) emptyFields.push("phoneNo");
        // if (!type) emptyFields.push("type");

        console.log("Empty fields:", emptyFields);

        if (emptyFields.length > 0) {
            console.log("Validation failed - missing required fields");
            return res.status(400).json({
                success: false,
                message: `Please fill in the following fields: ${emptyFields.join(", ")}`,
            });
        }

        console.log("Checking for existing distributor with phoneNo:", phoneNo.trim());
        const existingDistributor = await Distributor.findOne({ phoneNo: phoneNo.trim() });
        if (existingDistributor) {
            console.log("Distributor already exists with this phone number");
            return res.status(400).json({
                success: false,
                message: "A distributor with this phone number already exists",
            });
        }

        console.log("Password validation - length:", Password ? Password.length : 0);
        if (!Password || Password.length < 8) {
            console.log("Password validation failed");
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        console.log("Creating distributor in database...");
        const distributor = await Distributor.create({
            distributorEntityName,
            constitutionEntity,
            address,
            city,
            state,
            pincode,
            location,
            gstNo,
            panNo,
            FSSAINo,
            ownerName,
            phoneNo:Number(phoneNo),
            alternatePhoneNo:Number(alternatePhoneNo),
            email,
            associatedCompany,
            coverageArea,
            coverageAreaDescription,
            startingYear,
            numberOfCustomers,
            godownArea,
            noOfEmployees,
            noOfVehicles,
            typeOfVehicles,
            monthlyTurnOver,
            channelsOfOperation,
            typesOfOperation,
            businessOperations,
            website,
            noOfRetailerOutlets,
            customerFacilitiesProvided,
            associationRegisteredAs,
            nameOfHead,
            numberOfHead,
            nameOfExecutiveHead,
            numberOfExecutiveHead,
            memberOfAssociation,
            noOfAssociation,
            typeOfBusinessAssociation,
            isERPUsed,
            distributorAssociationName,
            noOfMember,
            type,
            Password
        });

        console.log("Distributor created successfully with ID:", distributor._id);

        // Handle file uploads if files are present
        if (req.files && req.files.length > 0) {
            console.log("Processing file uploads...");
            
            // Group files by fieldname
            const fileGroups = {};
            req.files.forEach(file => {
                console.log(`Processing file: ${file.fieldname} - ${file.originalname}`);
                
                // Handle array notation in fieldname (e.g., "officeAndGodownImage[0]")
                let fieldName = file.fieldname;
                if (fieldName.includes('[')) {
                    fieldName = fieldName.split('[')[0];
                }
                
                if (!fileGroups[fieldName]) {
                    fileGroups[fieldName] = [];
                }
                fileGroups[fieldName].push(file);
            });

            console.log("File groups:", Object.keys(fileGroups));

            // Handle officeAndGodownImage (multiple images)
            if (fileGroups.officeAndGodownImage) {
                console.log("Uploading office and godown images...");
                try {
                    const uploadedImages = await uploadMultipleImages(
                        fileGroups.officeAndGodownImage.map((file) => file.path)
                    );

                    const result = uploadedImages.map((image) => {
                        uploadedImages.push(image.public_id);
                        return {
                            url: image.image,
                            public_id: image.public_id
                        };
                    });
                    
                    distributor.officeAndGodownImage = result;
                    console.log("Office and godown images uploaded successfully");

                } catch (error) {
                    console.log("Error uploading office and godown images:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Error uploading office and godown images",
                        error: error.message
                    });
                }
            }

            // Handle single image uploads
            const singleImageFields = ['gstImage', 'fssaiImage', 'partner1Image', 'partner2Image', 'anyOtherDocImage'];
            
            for (const fieldName of singleImageFields) {
                if (fileGroups[fieldName] && fileGroups[fieldName].length > 0) {
                    console.log(`Uploading ${fieldName}...`);
                    try {
                        const uploadImage = await uploadSingleImage(fileGroups[fieldName][0].path);
                        uploadedImages.push(uploadImage.public_id);

                        distributor[fieldName] = {
                            url: uploadImage.image,
                            public_id: uploadImage.public_id
                        };
                        
                        console.log(`${fieldName} uploaded successfully`);

                    } catch (error) {
                        console.log(`Error uploading ${fieldName}:`, error);
                        return res.status(500).json({
                            success: false,
                            message: `Error uploading ${fieldName}`,
                            error: error.message
                        });
                    }
                }
            }
        } else {
            console.log("No files to upload");
        }

        console.log("Saving distributor with uploaded images...");
        await distributor.save();

        console.log("Distributor creation completed successfully");
        return res.status(200).json({
            success: true,
            message: "Distributor created successfully",
            data: distributor
        });

    } catch (error) {
        console.log("=== ERROR IN CREATE DISTRIBUTOR ===");
        console.log("Error message:", error.message);
        console.log("Error stack:", error.stack);
        console.log("Uploaded images to cleanup:", uploadedImages);

        // Cleanup uploaded images if there was an error
        if (uploadedImages.length > 0) {
            console.log("Cleaning up uploaded images...");
            try {
                for (const public_id of uploadedImages) {
                    await cloudinary.uploader.destroy(public_id);
                    console.log(`Deleted image with public_id: ${public_id}`);
                }
                console.log("All uploaded files have been deleted.");
            } catch (deleteError) {
                console.error("Error deleting files:", deleteError.message);
            }
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { phoneNo, Password } = req.body;
        if (!phoneNo || !Password) {
            return res.status(400).json({
                success: false,
                message: "Please provide phoneNo and Password",
            })
        }
        const distributor = await Distributor.findOne({ phoneNo });
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            })
        }
        const isPasswordMatch = await distributor.comparePassword(Password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password",
            })
        }
        if (distributor.isDeactivated === true) {
            return res.status(401).json({
                success: false,
                message: "Distributor is Deactivated",
            })
        }
        await sendToken(distributor, res, 200, "Login successful");
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.forgetpassword = async (req, res) => {
    try {
        const { phoneNo, newPassword } = req.body;
        if (!phoneNo) {
            return res.status(400).json({
                success: false,
                message: "Please provide phoneNo",
            });
        }
        const distributor = await Distributor.findOne({ phoneNo });
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        if (newPassword < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
            });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpires = Date.now() + 2 * 60 * 1000; // 2 minutes

        distributor.otp = otp;
        distributor.otpExpires = otpExpires;
        distributor.newPassword = newPassword
        await distributor.save();

        // Prepare email content
        const emailContent = {
            email: distributor.email,
            subject: "Password Reset OTP",
            message: `Hello ${distributor.distributorEntityName},\n\n` +
                `We received a request to reset your password.\n\n` +
                `Please use the OTP below to proceed with resetting your password:\n\n` +
                `OTP: ${otp}\n` +
                `This OTP is valid for 2 minutes (expires at: ${new Date(otpExpires).toISOString()}).\n\n` +
                `If you did not request a password reset, please ignore this email.\n\n` +
                `Thank you,\nTeam Uttar Pradesh Federation of Distributor Associations`,
        };


        // Send email
        await SendEmail(emailContent);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: {
                phoneNo: distributor.phoneNo,
                email: distributor.email,
                otpExpires: new Date(otpExpires).toISOString(),
            }
        });
    } catch (error) {
        console.error("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { phoneNo, otp } = req.body;
        if (!phoneNo || !otp) {
            return res.status(400).json({
                success: false,
                message: "Please provide phoneNo and otp",
            });
        }

        const distributor = await Distributor.findOne({ phoneNo });
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        if (distributor.otp !== Number(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (Date.now() > distributor.otpExpires) {
            distributor.otp = null;
            distributor.otpExpires = null;
            await distributor.save();
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        distributor.Password = distributor.newPassword
        distributor.otp = null;
        distributor.otpExpires = null;
        distributor.newPassword = null;
        await distributor.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getDistributors = async (req, res) => {
    try {
        const distributors = await Distributor.find({});
        if (!distributors) {
            return res.status(404).json({
                success: false,
                message: "Distributors not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Distributors fetched successfully",
            data: distributors
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.deleteForm = async (req, res) => {
    try {
        const distributor = await Distributor.findByIdAndDelete(req.params.id);
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Distributor deleted successfully",
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.getSingleDistributor = async (req, res) => {
    try {
        const distributor = await Distributor.findById(req.params.id);
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Distributor fetched successfully",
            data: distributor
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updateDistributor = async (req, res) => {
    const uploadedImages = [];
    try {
        const { id } = req.params;
        const {
            distributorEntityName,
            constitutionEntity,
            address,
            city,
            state,
            pincode,
            location,
            gstNo,
            panNo,
            FSSAINo,
            ownerName,
            phoneNo,
            alternatePhoneNo,
            email,
            associatedCompany,
            coverageArea,
            coverageAreaDescription,
            startingYear,
            numberOfCustomers,
            godownArea,
            noOfEmployees,
            noOfVehicles,
            typeOfVehicles,
            monthlyTurnOver,
            channelsOfOperation,
            typesOfOperation,
            businessOperations,
            website,
            noOfRetailerOutlets,
            customerFacilitiesProvided,
            associationRegisteredAs,
            nameOfHead,
            numberOfHead,
            nameOfExecutiveHead,
            numberOfExecutiveHead,
            memberOfAssociation,
            noOfAssociation,
            isERPUsed,
            distributorAssociationName,
            typeOfBusinessAssociation,
            noOfMember,
        } = req.body;

        const distributor = await Distributor.findById(id);
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            })
        }
        if (distributorEntityName) distributor.distributorEntityName = distributorEntityName;
        if (constitutionEntity) distributor.constitutionEntity = constitutionEntity;
        if (address) distributor.address = address;
        if (city) distributor.city = city;
        if (state) distributor.state = state;
        if (pincode) distributor.pincode = pincode;
        if (location) distributor.location = location;
        if (gstNo) distributor.gstNo = gstNo;
        if (panNo) distributor.panNo = panNo;
        if (FSSAINo) distributor.FSSAINo = FSSAINo;
        if (ownerName) distributor.ownerName = ownerName;
        if (phoneNo) distributor.phoneNo = phoneNo;
        if (alternatePhoneNo) distributor.alternatePhoneNo = alternatePhoneNo;
        if (email) distributor.email = email;
        if (associatedCompany) distributor.associatedCompany = associatedCompany;
        if (coverageArea) distributor.coverageArea = coverageArea;
        if (coverageAreaDescription) distributor.coverageAreaDescription = coverageAreaDescription;
        if (startingYear) distributor.startingYear = startingYear;
        if (numberOfCustomers) distributor.numberOfCustomers = numberOfCustomers;
        if (godownArea) distributor.godownArea = godownArea;
        if (noOfEmployees) distributor.noOfEmployees = noOfEmployees;
        if (noOfVehicles) distributor.noOfVehicles = noOfVehicles;
        if (typeOfVehicles) distributor.typeOfVehicles = typeOfVehicles;
        if (monthlyTurnOver) distributor.monthlyTurnOver = monthlyTurnOver;
        if (channelsOfOperation) distributor.channelsOfOperation = channelsOfOperation;
        if (typesOfOperation) distributor.typesOfOperation = typesOfOperation;
        if (businessOperations) distributor.businessOperations = businessOperations;
        if (isERPUsed) distributor.isERPUsed = isERPUsed;
        if (distributorAssociationName) distributor.distributorAssociationName = distributorAssociationName;
        if (website) distributor.website = website;
        if (noOfRetailerOutlets) distributor.noOfRetailerOutlets = noOfRetailerOutlets;
        if (customerFacilitiesProvided) distributor.customerFacilitiesProvided = customerFacilitiesProvided;
        if (associationRegisteredAs) distributor.associationRegisteredAs = associationRegisteredAs;
        if (nameOfHead) distributor.nameOfHead = nameOfHead;
        if (numberOfHead) distributor.numberOfHead = numberOfHead;
        if (nameOfExecutiveHead) distributor.nameOfExecutiveHead = nameOfExecutiveHead;
        if (numberOfExecutiveHead) distributor.numberOfExecutiveHead = numberOfExecutiveHead;
        if (memberOfAssociation) distributor.memberOfAssociation = memberOfAssociation;
        if (noOfAssociation) distributor.noOfAssociation = noOfAssociation;
        if (typeOfBusinessAssociation) distributor.typeOfBusinessAssociation = typeOfBusinessAssociation;
        if (noOfMember) distributor.noOfMember = noOfMember;

        if (req.files) {
            const { officeAndGodownImage, gstImage, fssaiImage, partner1Image, partner2Image, anyOtherDocImage } = req.files;
            if (officeAndGodownImage) {
                try {
                    if (distributor.officeAndGodownImage && distributor.officeAndGodownImage.length > 0) {
                        await deleteMultipleImages(distributor.officeAndGodownImage.map(img => img.public_id));
                    }
                    const uploadedImages = await uploadMultipleImages(
                        officeAndGodownImage.map((file) => file.path)
                    );

                    const result = uploadedImages.map((image) => {
                        uploadedImages.push(image.public_id);
                        return {
                            url: image.image,
                            public_id: image.public_id
                        }
                    })
                    distributor.officeAndGodownImage = result

                } catch (error) {
                    console.log("Internal server error", error)
                    res.status(500).json({
                        success: false,
                        message: "Internal server error",
                        error: error.message
                    })
                }
            }

            if (gstImage) {
                try {
                    if (distributor?.gstImage?.public_id) {
                        await deleteImage(distributor.gstImage.public_id)
                    }
                    const uploadImage = await uploadSingleImage(gstImage[0].path)
                    uploadedImages.push(uploadImage.public_id);

                    distributor.gstImage = {
                        url: uploadImage.image,
                        public_id: uploadImage.public_id
                    }

                } catch (error) {
                    console.log("Internal server error", error)
                    res.status(500).json({
                        success: false,
                        message: "Internal server error",
                        error: error.message
                    })
                }
            }

            if (fssaiImage) {
                try {
                    if (distributor?.fssaiImage?.public_id) {
                        await deleteImage(distributor.fssaiImage.public_id)
                    }
                    const uploadImage = await uploadSingleImage(fssaiImage[0].path)
                    uploadedImages.push(uploadImage.public_id);

                    distributor.fssaiImage = {
                        url: uploadImage.image,
                        public_id: uploadImage.public_id
                    }

                } catch (error) {
                    console.log("Internal server error", error)
                    res.status(500).json({
                        success: false,
                        message: "Internal server error",
                        error: error.message
                    })
                }
            }

            if (partner1Image) {
                try {
                    if (distributor?.partner1Image?.public_id) {
                        await deleteImage(distributor.partner1Image.public_id)
                    }
                    const uploadImage = await uploadSingleImage(partner1Image[0].path)
                    uploadedImages.push(uploadImage.public_id);

                    distributor.partner1Image = {
                        url: uploadImage.image,
                        public_id: uploadImage.public_id
                    }

                } catch (error) {
                    console.log("Internal server error", error)
                    res.status(500).json({
                        success: false,
                        message: "Internal server error",
                        error: error.message
                    })
                }
            }

            if (partner2Image) {
                try {
                    if (distributor?.partner2Image?.public_id) {
                        await deleteImage(distributor.partner2Image.public_id)
                    }
                    const uploadImage = await uploadSingleImage(partner2Image[0].path)
                    uploadedImages.push(uploadImage.public_id);

                    distributor.partner2Image = {
                        url: uploadImage.image,
                        public_id: uploadImage.public_id
                    }

                } catch (error) {
                    console.log("Internal server error", error)
                    res.status(500).json({
                        success: false,
                        message: "Internal server error",
                        error: error.message
                    })
                }
            }

            if (anyOtherDocImage) {
                try {
                    if (distributor?.anyOtherDocImage?.public_id) {
                        await deleteImage(distributor.anyOtherDocImage.public_id)
                    }
                    const uploadImage = await uploadSingleImage(anyOtherDocImage[0].path)
                    uploadedImages.push(uploadImage.public_id);

                    distributor.anyOtherDocImage = {
                        url: uploadImage.image,
                        public_id: uploadImage.public_id
                    }

                } catch (error) {
                    console.log("Internal server error", error)
                    res.status(500).json({
                        success: false,
                        message: "Internal server error",
                        error: error.message
                    })
                }
            }

        }

        await distributor.save();

        return res.status(200).json({
            success: true,
            message: 'Details updated',
            data: distributor
        })

    } catch (error) {
        console.log("Internal server error", error)
        if (uploadedImages.length > 0) {
            try {
                for (const public_id of uploadedImages) {
                    await cloudinary.uploader.destroy(public_id);
                }
                console.log("All uploaded files have been deleted.");
            } catch (deleteError) {
                console.error("Error deleting files:", deleteError.message);
            }
        }
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.uploadfileByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const fetchedDistributor = await Distributor.findById(id);
        if (!fetchedDistributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found"
            })
        }
        if (req.file) {
            if (fetchedDistributor.fileUploadedByAdmin && fetchedDistributor.fileUploadedByAdmin.public_id) {
                await deletePdfFromCloudinary(fetchedDistributor.fileUploadedByAdmin.public_id)
            }
            const imgURL = await uploadPDF(req.file.path)
            const { pdf, public_id } = imgURL;

            fetchedDistributor.fileUploadedByAdmin = {
                url: pdf,
                public_id: public_id
            }
        }
        await fetchedDistributor.save();
        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: fetchedDistributor
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.uploadfileByProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const fetchedDistributor = await Distributor.findById(id);
        if (!fetchedDistributor) {
            return res.status(404).json({
                success: false,
                message: "Provider not found"
            })
        }
        if (req.file) {
            if (fetchedDistributor.fileUploadedByDistributor && fetchedDistributor.fileUploadedByDistributor.public_id) {
                await deletePdfFromCloudinary(fetchedDistributor.fileUploadedByDistributor.public_id)
            }
            const imgURL = await uploadPDF(req.file.path)
            const { pdf, public_id } = imgURL;

            fetchedDistributor.fileUploadedByDistributor = {
                url: pdf,
                public_id: public_id
            }
        }
        await fetchedDistributor.save();
        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: fetchedDistributor
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.uploadfilesByAdmin = async (req, res) => {
    try {
        let { ids } = req.body; // Can be a single ID or an array of IDs
        let parsedid = JSON.parse(ids)

        if (!parsedid) {
            return res.status(400).json({
                success: false,
                message: "Distributor ID(s) required",
            });
        }

        // Ensure `ids` is always an array for uniform processing
        if (!Array.isArray(parsedid)) {
            parsedid = [parsedid]; // Convert single ID to an array
        }

        const fetchedDistributors = await Distributor.find({ _id: { $in: parsedid } });
        if (fetchedDistributors.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No distributors found for the given ID(s)",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // Upload file to Cloudinary
        const uploadedFile = await uploadPDF(req.file.path);
        const { pdf, public_id } = uploadedFile;

        // Update all fetched distributors with the new file
        for (let distributor of fetchedDistributors) {
            // Delete existing file if present
            if (distributor.fileUploadedByAdmin && distributor.fileUploadedByAdmin.public_id) {
                await deletePdfFromCloudinary(distributor.fileUploadedByAdmin.public_id);
            }
            distributor.fileUploadedByAdmin = { url: pdf, public_id };
            await distributor.save();
        }

        return res.status(200).json({
            success: true,
            message: `File uploaded successfully for ${fetchedDistributors.length} Provider(s)`,
            data: fetchedDistributors
        });

    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.changeVerifiedStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const fetchedDistributor = await Distributor.findById(id);
        if (!fetchedDistributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found"
            })
        }
        fetchedDistributor.isVerified = !fetchedDistributor.isVerified;
        await fetchedDistributor.save();
        return res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: fetchedDistributor
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}