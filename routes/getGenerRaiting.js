let express = require('express');
let router = express.Router();
let store = require('store');

const {getMovieListFromMongo} = require("../services/GenreRaiting-servise");



router.get('/get_genre_raiting', (req, res) => {

    if (req.query.genre === undefined) {
        return res.send(`Please, enter genre`)
    }

    let genre = req.query.genre;
    genre = genre.toLowerCase();

    console.log(`genre here : ${genre}, processing now ${store.get("flag")}`);

    getMovieListFromMongo(genre)
        .then(response => {
            if (response !== null &&  store.get("genre") !== genre) {
                res.status(200).send(response)
            }

            if (response === null) {
                if(store.get("rating_counter") !== undefined){
                    let result = store.get("current_limit") / store.get("limit") * 100;
                    console.log(result);
                    res.status(200).send(`Calculation is in process, progress percent:  ${Math.round(result)}%`)
                } else {
                    res.status(200).send('No data in DB about this genre. Send request on this url /genre_raiting ')
                }
            }
        })
        .catch(err => res.status(500).send(err))
});

module.exports = router;