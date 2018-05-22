const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
UserSchema.plugin(passportLocalMongoose); //добавляет к схеме фичу.
var User = mongoose.model("User", UserSchema);


module.exports = User;