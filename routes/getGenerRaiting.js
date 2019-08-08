let express = require('express');
let router = express.Router();
let store = require('store');

const {getMovieListFromMongo} = require("../services/GenreRaiting-servise");



router.get('/get_genre_raiting', (req, res) => {

    if (req.query.genre === '') {
        return res.send(`Please, enter genre`)
    }

    let genre = req.query.genre;

    if (genre !== undefined) {
        genre = genre.toLowerCase();
    }


    getMovieListFromMongo(genre)
        .then(response => {

            if(genre === undefined) {
                if(store.get("rating_counter") !== undefined){
                    let result = store.get("current_limit") / store.get("limit") * 100;
                    console.log(result);
                    return res.status(200).send(`Calculation is in process, progress percent:  ${Math.round(result)}%`)
                } else {
                    if (store.get("limit") !== undefined){
                        return res.status(200).send('Please, wait for a while, progress counting will begin soon')
                    } else {
                        return res.status(200).send('Start the /genre_raiting firstly, or indicate the ?genre= to request rating from DB')
                    }

                }
            }

            if (response === null) {
                return res.status(200).send('No data in DB about this genre. Send request on this url /genre_raiting ')
            }

            if (response !== null) {
                return res.status(200).send(response)
            }
        })
        .catch(err => res.status(500).send(err))
});

module.exports = router;