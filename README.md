# How to use ?

## Description: 
##### This is a middleware api server with partial functionality of MovieDB API. All results store in MongoDB after request, and would be received from DB after  
##### The latest version deployed on https://mvdb-api.herokuapp.com/
## What can you do ?
##### 1. Getting a list of films with the ability to filter, sort and limit the number of results
##### 2. Obtaining details on a specific movie
##### 3. Getting the average rating for the genre. ( You can call only one request and wait for it to complete. API does not support asynchronous call rating calculation )

## Run server locally:
```bash
$ npm install
$ npm start
```
###### Server running on PORT=3001 by default

## API routes

### GET /movie_list 
###### Return list of movies filtered and sorted by params

#### 1. Supported params: 
##### ```&sort```: sort type ( .desc = from highest to lowest, .asc = from lowest to highest )
```
Example: &sort=popularity.desc
```
###### =popularity - sorting by popularity on TMDB
###### =release_date - sorting by movie release date
###### =revenue - sorting by movie's income
###### =primary_release_date - sorting by first movie date 
###### =original_title - sorting by original ( on original language ) title
###### =vote_average - sorting by TMDB user's average rating
###### =vote_count - sorting by amount of TMDB user's votes
###### note: if query is empty or &sort is lost:  ```&sort=popularity.desc``` by default

##### (optional) ```&genre```: include movies with this genre
```
Example: &genre=Action
```
###### Genres available ( capital letters are not important ): action, adventure, animation, comedy, crime, documentary, drama, family, fantasy, horror, history, music, mystery, romance, science fiction, tv movie, thriller, war, western
###### note: if query is empty or &genre is lost: genre param won't be included in request

##### (optional) ```&year```: include movies released this year ( Can't be less than 1874 )
```
Example: &year=2015
```
###### note: if query is empty or &year is lost: genre param won't be included in request

##### ```&page``` and ```&amount```: The variables introduced for the universality api. Allows you to mentally break all the movies into &amount and display a specific &page with these movies. (```&amount``` can't be more than 600, due to problems with a large number of requests to TMDB API. ```&amount * &page``` can't be more than 20000, due to limitations of TMDB API, api does not allow to fetch 20001 movie and further )

###### note: if query is empty or &page/&amount is lost: ```&page=1``` and ```&amount=20``` by default
```
Example: &page=2&amount=4  (will return from 5'th to 8'th movies from requested list)
```
#### 2. Store movies after request as 20 movies for current params query and page. Stored movies will be used again in same request (relies on order, year, genre, page and amount are not important). If part of movies are stored in DB, the first part will be received from DB, the rest movies will be fetched from TMDB API and also stored in DB. Order of params is not important.

#### 3. Returns json file with fields of my_id (your requested link without ```&amount``` and with uniq calculated ```&page``` to be able to be stored in DB), page (uniq calculated ```&page```), total_results, total_pages (TMDB stats), array of movies.
```
Example: https://mvdb-api.herokuapp.com/movie_list?sort=popularity.desc&genre=animation&year=2015&page=1&amount=70
```

### GET /movie_details
###### Return current movie details by TMDB uniq movie iq.

#### 1. Supported params: 
##### ```&movie_id```: TMDB uniq movie iq
```
Example: &movie_id=420818
```

#### 2. Store movie in DB, will be received from DB next time on the same request.

#### 3. Returns json file with fields of my_id (your requested link) and movie details
```
Example: https://mvdb-api.herokuapp.com/movie_details?movie_id=420818
```



### GET /genre_raiting
###### Start process of calculating average rating by genre. (Server iterates over all the movies for this genre. Cannot iterate over 1000 pages of 20 films due to limitations of TMDB API. Also server asynchronously iterates only 600 movies every 12 seconds due to problems with a large number of requests to TMDB API). You can start only 1 process of calculating, new request will start a new calculation.

#### 1. Supported params: 
##### ```&genre```: include movies with this genre
```
Example: &genre=Action
```

#### 2. Store calculated rating in DB. If this genre rating is already exits in db, remove elder result from DB on new request.

#### 3. Returns message that calculated started
```
Example: https://mvdb-api.herokuapp.com/genre_raiting?genre=music
```

### GET /get_genre_raiting
###### 

#### 1. Supported params: 
##### ```&genre```: display result of calculating by this genre.
```
Example: &genre=Action
```
#### NO PARAMS: Display progress percent, if it was started

#### 2. Display current progress in percent. If rating is in DB, display it. 

#### 3. Returns message with progress percent or json file with genre and rating
```
Example: https://mvdb-api.herokuapp.com/get_genre_raiting?genre=music
```


