let express = require('express');
let router = express.Router();

const {getMovieListFromApi} = require("../services/MovieDetails-service");
const {getMovieListFromMongo} = require("../services/MovieDetails-service");
const {postMovieListToMongo} = require("../services/MovieDetails-service");


// GET
router.get('/movie_details', (req, res) => {

    let movie_id = req.query.movie_id;


    getMovieListFromMongo(req.originalUrl)
        .then(response => {
            if (response !== null) {
                res.status(200).send(response)
            }

            if (response === null) {
                getMovieListFromApi(movie_id)
                    .then(doc => {
                        let result = doc.data;
                        result.my_id = req.originalUrl;

                        console.log(result)

                        postMovieListToMongo(result);

                        res.status(201).send(result)
                    })
                    .catch(err => res.status(500).send(err))
            }
        })
        .catch(err => res.status(500).send(err))
})

module.exports = router