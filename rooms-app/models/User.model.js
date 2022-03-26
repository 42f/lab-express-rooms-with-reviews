const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: String,
    password: String,
    fullName: String,
    // slack login - optional
    slackID: String,
    // google login - optional
    googleID: String
  },
  {
    timestamps: true
  }
);

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
    .then(isMatch => isMatch)
    .catch(err => {
      console.error(err);
      return false;
    });
};

const User = model("User", userSchema);

module.exports = User;
