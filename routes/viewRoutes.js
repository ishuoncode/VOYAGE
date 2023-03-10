const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();
// router.use(authController.isLoggedIn);

router.get('/', (req, res) => {
  res.status(200).render('home');
});
router.get(
  '/overview',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
// router.get(
//   '/forgotpassword',
//   viewController.getForgotPasswordForm,
//   authController.forgotPassword
// );
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);
// router.patch('/resetPassword', viewController.resetPassword);
module.exports = router;
