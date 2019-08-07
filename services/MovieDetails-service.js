let axios = require('axios');
let Details = require('../models/movie.details');



module.exports.getMovieListFromMongo = (query_id) => {
    return Details.findOne({my_id: query_id})
};

module.exports.postMovieListToMongo = (data) => {
    let model = new Details(data);
    model.save()
        .then(res => console.log(`data created in DB successfully :  ${data.my_id}`))
        .catch(err => console.error(err))
};


module.exports.getMovieListFromApi = (movie_id) => {
    return axios
        .get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=56d793d6cea47e6ab2101f3386c7b8b6&language=en-US`)
};
