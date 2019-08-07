let mongoose = require('mongoose')

mongoose.connect('mongodb+srv://bukilan:jHTOIDvhRG5l3qbZ@moviedbapi-vhuqt.mongodb.net/test?retryWrites=true&w=majority', {'useNewUrlParser': true});
mongoose.set('useCreateIndex', true);

let ListSchema = new mongoose.Schema({
    my_id: {type: String, unique: true},
    page: Number,
    total_results: Number,
    total_pages: Number,
    results: [
        {
            vote_count: Number,
            id: Number,
            video: Boolean,
            vote_average: Number,
            title: String,
            popularity: Number,
            poster_path: String,
            original_language: String,
            original_title: String,
            genre_ids: [
                Number
            ],
            backdrop_path: String,
            adult: Boolean,
            overview: String,
        }
    ]
});

module.exports = mongoose.model('List', ListSchema);