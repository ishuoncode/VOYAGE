const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.get('/forgotPassword', viewController.getForgotPasswordForm);

router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/resetPassword/:token', viewController.getResetPasswordForm);

// Protect all routes after this middleware (we can do this bcoz router.use run sequentially)
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin')); // only admin can access below route after this middleware

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
