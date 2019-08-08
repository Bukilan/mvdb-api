let axios = require('axios');
let ListModel = require('../models/movie.list');

function isNumber (n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }


module.exports.getMovieListFromApi = (query_id, sort, page , genre, year) => {

    if (genre === '') { }

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

    let str_genre, str_year;

    if (genre === ''){
        str_genre = ''
    } else str_genre = `&with_genres=${genre}`;

    if (genre === ''){
        str_year = ''
    } else str_year = `&primary_release_year=${year}`;

    return axios
        .get(`https://api.themoviedb.org/3/discover/movie?api_key=56d793d6cea47e6ab2101f3386c7b8b6&language=en-US&sort_by=${sort}&include_adult=false&include_video=false&page=${page}${str_genre}${str_year}`)
};

module.exports.getMovieListFromMongo = (custom_query_id) => {
    return ListModel.findOne({my_id: custom_query_id})
};

module.exports.postMovieListToMongo = (data) => {
    let model = new ListModel(data);
    model.save()
        .then(res => console.log(`data created in DB successfully :  ${data.my_id}`))
        .catch(err => console.error(err))
};

module.exports.getMovieListIds =  (page, amount, custom_query_id) => {

    if (amount < 0 || page < 0 || isNumber(amount) === false || isNumber(page) === false) {
        amount = 20;
        page = 1;
    }

    let arr = [];
    let elem_amount = amount*page;
    let amount_mod = elem_amount % 20;
    let amount_div = ( elem_amount / 20 >> 0 ) + 1;



    if (amount < 20) {
        if (amount_mod < amount) {
            let tmp_first = {
                url: `${custom_query_id}&page=${amount_div}`,
                start_element: 0,
                end_element: amount_mod-1,
                page: amount_div
            };
            let tmp_amount_div = amount_div - 1;
            let tmp_last = {
                url: `${custom_query_id}&page=${tmp_amount_div}`,
                start_element: 19 - amount + amount_mod + 1,
                end_element: 19,
                page: tmp_amount_div
            };
            arr = arr.concat([tmp_first,tmp_last]);
        }
        if (amount_mod > amount){
            let tmp = {
                url: `${custom_query_id}&page=${amount_div}`,
                start_element: amount_mod - amount,
                end_element: amount_mod-1,
                page: amount_div
            };
            arr = arr.concat([tmp]);
        }
        if (amount == amount_mod) {
            let tmp = {
                url: `${custom_query_id}&page=${amount_div}`,
                start_element: 0,
                end_element: amount_mod-1,
                page: amount_div
            };
            arr = arr.concat([tmp]);
        }
    }

    if (amount == 20) {
        let tmp_amount_div = amount_div - 1;
        let tmp = {
            url: `${custom_query_id}&page=${tmp_amount_div}`,
            start_element: 0,
            end_element: 19,
            page: tmp_amount_div
        };
        arr = arr.concat([tmp]);
    }

    if (amount > 20) {
        let tmp_amount_mod = amount % 20;
        let tmp_amount_div =  amount / 20 >> 0;

        let endpoint = 0;
        if (tmp_amount_mod == 0) {endpoint++}

        for (let i = tmp_amount_div ; i >= endpoint; i--) {
            let tmp_tmp_amount_div = amount_div - i;
            let tmp_tmp_amount_mod = 20;
            if (i === 0) {
                tmp_tmp_amount_mod = tmp_amount_mod
            }
            let tmp = {
                url: `${custom_query_id}&page=${tmp_tmp_amount_div}`,
                start_element: 0,
                end_element: tmp_tmp_amount_mod - 1,
                page: tmp_tmp_amount_div
            };
            arr = arr.concat([tmp]);
        }
    }
    return arr;
};

module.exports.collectResult = (new_results, min_page, max_page) => {
    let final_result = [];
    for (let j = min_page; j <= max_page; j++) {
        new_results.forEach(item => {
            if(item.page_key == j) {
                final_result = final_result.concat(item.arr)
            }
        })
    }
    return final_result
};