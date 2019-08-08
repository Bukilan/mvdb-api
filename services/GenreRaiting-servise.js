let axios = require('axios');
let Genre = require('../models/genre.raiting');



module.exports.getMovieListFromMongo = (genre) => {
    return Genre.findOne({genre: genre})
};

module.exports.postMovieListToMongo = (data) => {
    let model = new Genre(data);
    model.save()
        .then(res => console.log(`data created in DB successfully `))
        .catch(err => console.error(err))
};

module.exports.deleteMovieListFromMongo = (genre) => {
    return Genre.findOneAndRemove({genre: genre})
};


module.exports.getMovieListFromApi = (genre, page) => {

    switch (genre.toLowerCase()) {
        case "action":
            genre = 28;
            break;
        case "adventure":
            genre = 12;
            break;
        case "animation":
            genre = 16;
            break;
        case "comedy":
            genre = 35;
            break;
        case "crime":
            genre = 80;
            break;
        case "documentary":
            genre = 99;
            break;
        case "drama":
            genre = 18;
            break;
        case "family":
            genre = 10751;
            break;
        case "fantasy":
            genre = 14;
            break;
        case "horror":
            genre = 27;
            break;
        case "history":
            genre = 36;
            break;
        case "music":
            genre = 10402;
            break;
        case "mystery":
            genre = 9648;
            break;
        case "romance":
            genre = 10749;
            break;
        case "science fiction":
            genre = 878;
            break;
        case "tv movie":
            genre = 10770;
            break;
        case "thriller":
            genre = 53;
            break;
        case "war":
            genre = 10752;
            break;
        case "western":
            genre = 37;
            break;
        default:
            genre = '';
            break;
    }

    return axios
        .get(`https://api.themoviedb.org/3/discover/movie?api_key=56d793d6cea47e6ab2101f3386c7b8b6&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genre}`)
};


