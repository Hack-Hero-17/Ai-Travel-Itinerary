const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // Ensure UID is unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    password: {
      type: String,
      required: true,
    },
    registrationTime: {
      type: String,
      required: true,
    },
    provider: {
      type: String, // Will be "google" for Google signups
      default: "email", // Default to email signups
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password if it's modified or new
  try {
    const salt = await bcrypt.genSalt(10); // Salt rounds: 10
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare the password (for login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
