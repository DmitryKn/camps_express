const mongoose = require('mongoose');

var campSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
     }
  ]
})
var Campground = mongoose.model("Camp", campSchema);

module.exports = Campground;
