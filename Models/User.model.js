const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// ------------ storing password as hash using bcrypt ------------ using pre method of mongoose shema as it will be running before save method

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// -------------  CALLED after saving a user -------------------
// UserSchema.post('save',async function(next){
//   try {
//     console.log("Called after saving a user");
//   } catch (error) {
//     next(error)
//   }
// })
// -----------------------------------------------------------

// isvalidpassword method to check password during login
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = model("user", UserSchema);

module.exports = { User };
