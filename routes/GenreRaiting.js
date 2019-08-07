let express = require('express');
let router = express.Router();
let store = require('store')
let sleep = require('system-sleep');

const {getMovieListFromApi} = require("../services/GenreRaiting-servise");
const {postMovieListToMongo} = require("../services/GenreRaiting-servise");



router.get('/genre_raiting', function(req, res) {

    if( store.get("flag") === true){
        return res.send(`Запрос по жанру ${req.query.genre} уже выполняется`)
    }

    if (req.query.genre === undefined) {
        return res.send(`Введите, пожалуйста, жанр`)
    }

    let genre = req.query.genre;
    genre = genre.toLowerCase();

    if( genre === 'action' || genre === 'adventure' || genre === 'animation' || genre === 'comedy' || genre === 'crime' || genre === 'documentary' || genre === 'drama' || genre === 'family' || genre === 'fantasy' || genre === 'horror' || genre === 'history' || genre === 'music' || genre === 'mystery' || genre === 'romance' || genre === 'science fiction' || genre === 'tv movie' || genre === 'thriller' || genre === 'war' || genre === 'western'){
        res.send(`запрос по жанру: ${genre} начался. Отправьте GET запрос на адрес /get_genre_raiting с указанием параметра жанра, чтобы узнать процент выполнения. По окончанию подсчета, результат окажется в базе, отправьте запрос на /get_genre_raiting еще раз, чтобы узнать результат`)
    } else {
        return res.send(`Неверный жанр`)
    }


    store.clearAll();

    store.set("flag", true);
    store.set("genre", genre);

    store.set("total_films", 0);

    store.set("rating_counter", 0);

    store.set("current_limit", 0);
    store.set("limit", 0);

    let total_films, total_pages;

    let page_counter = 0;

    let limiter = 0;
    let current_limit = 1;



    getMovieListFromApi(genre,1)
            .then((response)=> {
                total_films = response.data.total_results;
                total_pages = response.data.total_pages;

                if (total_pages > 1000) {
                    total_pages = 1000;
                    total_films = 20000;
                }

                store.set("total_films", total_films);

                limiter = total_pages / 30 >> 0;
                if (total_pages % 30 > 0) {limiter ++}

                store.set("limit", limiter);

                console.log(total_films, total_pages);

                for (let j = 1; j <= limiter; j++) {
                    console.log(`началась новая итерация № ${j}`);

                    sleep(12000);

                    store.set("current_limit", j);

                        for (let i = 1; i <= 30; i++) {

                            getMovieListFromApi(genre, i)
                                .then((doc) => {

                                    let counter = 0;
                                    page_counter++;

                                    doc.data.results.forEach((item) => {
                                        let vote = parseFloat(item.vote_average);
                                        counter += vote;
                                    });

                                    let tmp = store.get("rating_counter");
                                    tmp += counter;
                                    store.set("rating_counter", tmp);

                                    if (page_counter == total_pages) {
                                        console.log('done')
                                        let obj = {
                                            genre: genre,
                                            rating: Math.round(store.get("rating_counter")) / Math.round(store.get("total_films"))
                                        };
                                        postMovieListToMongo(obj);
                                        store.set("flag", false);
                                    }

                                    if (i === 30) {
                                        current_limit++
                                    }

                                })
                                .catch((err) => {
                                    return res.status(500).send(err)
                                });
                        }
                }


            })
            .catch((err) => {
                return res.status(500).send(err)
            });

    store.clearAll();

});




module.exports = router