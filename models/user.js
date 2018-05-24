const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {type: Boolean, default: false}
});
UserSchema.plugin(passportLocalMongoose); //добавляет к схеме фичу.
const User = mongoose.model("User", UserSchema);


module.exports = User;
