let mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bukilan:UvkWNrIRY84ifxn5@moviedbapi-vhuqt.mongodb.net/test?retryWrites=true&w=majority', {'useNewUrlParser': true});
mongoose.set('useCreateIndex', true);

let ListSchema = new mongoose.Schema({
    genre: String,
    rating: Number
});

module.exports = mongoose.model('Genre', ListSchema);