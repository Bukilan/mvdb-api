let mongoose = require('mongoose')

mongoose.connect('mongodb+srv://bukilan:jHTOIDvhRG5l3qbZ@moviedbapi-vhuqt.mongodb.net/test?retryWrites=true&w=majority', {'useNewUrlParser': true});
mongoose.set('useCreateIndex', true);

let CustomerSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('Customer', CustomerSchema)
