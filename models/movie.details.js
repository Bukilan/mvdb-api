let mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bukilan:UvkWNrIRY84ifxn5@moviedbapi-vhuqt.mongodb.net/test?retryWrites=true&w=majority', {'useNewUrlParser': true});
mongoose.set('useCreateIndex', true);

let ListSchema = new mongoose.Schema({
    my_id: {type: String, unique: true},
    adult: Boolean,
    backdrop_path: String,
    belongs_to_collection: String,
    budget: Number,
    genres: [{
        id: Number,
        name: String
    }],
    homepage: String,
    id: Number,
    imdb_id: String,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    production_companies: [{
        id: Number,
        logo_path: String,
        name: String,
        origin_country: String
    }],
    production_countries: [{
        iso_3166_1: String,
        name: String
    }],
    release_date: String,
    revenue: Number,
    runtime: Number,
    spoken_languages: [{
        iso_639_1: String,
        name: String
    }],
    status: String,
    tagline: String,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number
})

module.exports = mongoose.model('Details', ListSchema);