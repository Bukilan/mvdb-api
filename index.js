let express = require('express');

let listRoute = require('./routes/MovieList');
let personRoute = require('./routes/person');
let customerRoute = require('./routes/customer');
let DetailsRoute = require('./routes/MovieDetails');
let GenreRoute = require('./routes/GenreRaiting');
let getGenreRoute = require('./routes/getGenerRaiting');

let path = require('path');
let bodyParser = require('body-parser');


let app = express();



app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body);
  next()
});


app.use(listRoute);
app.use(DetailsRoute);
app.use(GenreRoute);
app.use(getGenreRoute);
app.use(personRoute);
app.use(customerRoute);
app.use(express.static('public'));

app.use((req, res, next) => {
  res.status(404).send('We think you are lost!')
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));