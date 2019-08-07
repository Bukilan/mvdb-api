let express = require('express');
let router = express.Router();
let store = require('store');

const {getMovieListFromMongo} = require("../services/GenreRaiting-servise");



router.get('/get_genre_raiting', (req, res) => {

    let genre = req.query.genre;
    genre = genre.toLowerCase();

    getMovieListFromMongo(genre)
        .then(response => {
            if (response !== null) {
                res.status(200).send(response)
            }

            if (response === null) {
                if(store.get("rating_counter") !== undefined){
                    let result = store.get("current_limit") / store.get("limit") * 100
                    console.log(result);
                    res.status(200).send(`Подсчет рейтинга по жанру идет, процент вополнения:  ${Math.round(result)}%`)
                } else {
                    res.status(200).send('В базе данные нет рейтинга на этот жанр. Отправьте запрос на /genre_raiting ')
                }
            }
        })
        .catch(err => res.status(500).send(err))
})

module.exports = router