let express = require('express')
let router = express.Router()

const {getMovieListFromApi} = require("../services/movielist-sevice");
const {getMovieListFromMongo} = require("../services/movielist-sevice");
const {postMovieListToMongo} = require("../services/movielist-sevice");
const {getMovieListIds} = require("../services/movielist-sevice");
const {collectResult} = require("../services/movielist-sevice");



//TODO: проверить


// GET
router.get('/movie_list', (req, res) => {
    let sort, year, genre, page, amount, str_genre, str_year, arr;

    page = req.query.page;
    amount = req.query.amount;
    year = req.query.year;

    if (amount > 600 || page * amount > 20000){
        return res.status(501).send('Простите, AMOUNT должен быть меньше или равен 600, PAGE * AMOUNT меньше ли равен 20000')
    }


    if (page === undefined){page = 1}
    if (amount === undefined){amount = 20}

    sort = req.query.sort;
    if (sort === undefined) {sort = 'popularity.desc'}

    genre = req.query.genre;
    if (genre === undefined){
        genre = ''
        str_genre = ''
    } else str_genre = `&with_genres=${genre}`;

    if (year === undefined){
        year = ''
        str_year = ''
    } else str_year = `&year=${year}`;

    let custom_query_id = `/movie_list?sort=${sort}${str_year}${str_genre}`;


    let new_results = [];

    arr = getMovieListIds(page,amount,custom_query_id);

    let arr_page = [];

    for (let i = 0; i < arr.length; i++) {
        arr_page.push(arr[i].page)
    }

    let max_page, min_page;

    max_page = Math.max(...arr_page);
    min_page = Math.min(...arr_page);

    console.log(arr);



    for (let i = 0; i < arr.length; i++) {
        getMovieListFromMongo(arr[i].url)
            .then(doc => {

                if (doc !== null) {
                    console.log(`doc in db`);

                    let new_arr = {
                        'page_key': arr[i].page,
                        'arr': doc.results.slice(arr[i].start_element, arr[i].end_element + 1)
                    };

                    new_results.push(new_arr);

                    console.log(new_results.length);

                    if(new_results.length == arr.length){
                        let final_result = collectResult(new_results,min_page,max_page);

                        let obj = {
                            my_id: custom_query_id+`&page=${page}&amount=${amount}`,
                            page: page,
                            total_results: doc.total_results,
                            total_pages: doc.total_pages,
                            results: final_result
                        };

                        res.status(200).send(obj);
                    }
                }

                if (doc === null) {
                    getMovieListFromApi(arr[i].url, sort, arr[i].page, genre, year)
                        .then(response => {

                            console.log(`no doc in db`);
                            const organizationData = response.data;

                            let obj = {
                                my_id: arr[i].url,
                                page: arr[i].page,
                                total_results: organizationData.total_results,
                                total_pages: organizationData.total_pages,
                                results: organizationData.results
                            };

                            postMovieListToMongo(obj);

                            let new_arr = {
                                'page_key': arr[i].page,
                                'arr': obj.results.slice(arr[i].start_element, arr[i].end_element + 1)
                            };

                            new_results.push(new_arr);

                            if(new_results.length == arr.length){
                                let final_result = collectResult(new_results,min_page,max_page);

                                let new_obj = {
                                    my_id: custom_query_id+`&page=${page}&amount=${amount}`,
                                    page: page,
                                    total_results: obj.total_results,
                                    total_pages: obj.total_pages,
                                    results: final_result
                                };

                                res.status(201).send(new_obj);
                            }
                        })
                         .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))

    }


})

module.exports = router;