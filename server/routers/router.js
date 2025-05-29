const express = require("express");
const { createDistributor, getDistributors, deleteForm, login, updateDistributor, getSingleDistributor, uploadfileByAdmin, uploadfileByProvider, uploadfilesByAdmin, changeVerifiedStatus, forgetpassword, verifyOTP } = require("../controllers/distributor.controller");
const upload = require("../middlewares/multer");
const { createBanner, getBanners, getSingleBanner, deleteBanner, updateBannerStatus, updatebanner } = require("../controllers/banner.controller");
const { createInquiry, getInquiries, deleteInquiry } = require("../controllers/inquiry.controller");
const { createBlog, getAllBlogs, getSingleBlog, updateBlog, deleteBlog } = require("../controllers/blog.controller");
const { createReview, getAllReview, getReviewByProviderId } = require("../controllers/review.controller");
const { createNewsRoom, getAllNewsRooms, deleteNewsRoom, getSingleNewsRoom, updateNewsRoom } = require("../controllers/newsRoom.Controller");
const router = express.Router();

// Middleware to handle file uploads
const fileUpload = upload.fields([
    { name: 'officeAndGodownImage', maxCount: 5 },
    { name: 'gstImage', maxCount: 1 },
    { name: 'fssaiImage', maxCount: 1 },
    { name: 'partner1Image', maxCount: 1 },
    { name: 'partner2Image', maxCount: 1 },
    { name: 'anyOtherDocImage', maxCount: 1 },
]);

router.post("/create_distributor", fileUpload, createDistributor);
router.get('/get_distributor', getDistributors);
router.get('/get_distributor_by_id/:id', getSingleDistributor);
router.delete('/delete_form/:id', deleteForm);
router.post('/login', login)
router.put('/update_profile/:id', fileUpload, updateDistributor)
router.put('/update_file_By_admin/:id', upload.single('fileUploadedByAdmin'), uploadfileByAdmin)
router.post('/update_files_By_admin', upload.single('fileUploadedByAdmin'), uploadfilesByAdmin)
router.put('/update_file_By_provider/:id', upload.single('fileUploadedByDistributor'), uploadfileByProvider)
router.put('/update_verify_status/:id', changeVerifiedStatus)
router.post('/forget_password', forgetpassword)
router.post('/verify_otp', verifyOTP)

// banner router here 
router.post('/create_banner', upload.single('image'), createBanner)
router.get('/get_banners', getBanners)
router.get('/get_banner/:id', getSingleBanner)
router.put('/update_banner/:id', upload.single('image'), updatebanner)
router.delete('/delete_banner/:id', deleteBanner)
router.put('/update_status/:id', updateBannerStatus)

// inquiry router here 

router.post('/create_inquiry', createInquiry)
router.get('/get_inquiries', getInquiries)
router.delete('/delete_inquiry/:id', deleteInquiry)

// blog router here 
router.post('/create_blog', upload.single('image'), createBlog)
router.get('/get_blogs', getAllBlogs)
router.get('/get_blog/:id', getSingleBlog)
router.put('/update_blog/:id', upload.single('image'), updateBlog)
router.delete('/delete_blog/:id', deleteBlog)

// review router here 
router.post('/create_review', createReview)
router.get('/all_review', getAllReview)
router.get('/review_by_provider/:_id', getReviewByProviderId)

// news room router here
router.post('/create_news', createNewsRoom)
router.get('/get_news', getAllNewsRooms)
router.get('/get_single_news/:id', getSingleNewsRoom)
router.delete('/delete_news/:id', deleteNewsRoom)
router.put('/update_news/:id', updateNewsRoom)

module.exports = router;