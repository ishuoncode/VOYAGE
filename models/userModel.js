const mongoose = require('mongoose');
const validator = require('validator');
const argon2 = require('argon2');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please tell us your name!'] },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'please provide a valid email address'],
    lowercase: true
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a confirm password'],
    //THIS ONLY WORK ON SAVE and ON CREATE ONLY
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password are not match'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: { type: Boolean, default: true, select: false }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await argon2.hash(this.password);
  //delete THE CONFIRM PASSWORD FEILD
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre(/^find/, function(next) {
  //this point to the current query that start with word find
  this.find({ active: true });
  next();
});
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 100000;
  next();
});
userSchema.methods.correctPassword = async function(
  userPassword,
  candidatePassword
) {
  return await argon2.verify(userPassword, candidatePassword);
};
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  // return JWTTimestamp < changedTimestamp;
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log(this.passwordResetToken, { resetToken });
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
