const express = require('express');
const bodyParser = require('body-parser')
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const Article = require('./articles/Article');
const Category = require('./categories/Category');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

connection.authenticate()
    .then(() => {
        console.log("Database connected successful");
    })
    .catch((error) => {
        console.log(error);
    });

app.use("/category", categoriesController);
app.use("/article", articlesController);

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})