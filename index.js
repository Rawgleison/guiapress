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

app.use("/categories", categoriesController);
app.use("/articles", articlesController);

app.get('/', (req, res) => {
    res.redirect("/1")
})

app.get("/:page", (req, res) => {
    const { page } = req.params;

    if (isNaN(page) || page < 1) {
        page = 1;
    }

    const limit = 4;
    var offset = ((page ?? 1) - 1) * limit;

    Article.findAndCountAll({
        limit,
        offset
    }).then(articles => {
        const result = {};
        result.eof = (offset + limit) > articles.count;
        result.count = articles.count;
        result.pageprev = parseInt(page) - 1;
        result.pagenext = parseInt(page) + 1;
        result.page = page;
        articles = articles.rows;

        Category.findAll().then(categories => {
            var link = 'index.ejs';
            if (page > 1) {
                link = 'paginate.ejs'
            }
            res.render(link, { result, articles, categories, home: {} });
        })
    })
})

app.get('/:SlugCategory', async (req, res) => {
    const { SlugCategory } = req.params;
    const category = await Category.findOne({ where: { slug: SlugCategory } });
    if (!category) {
        res.redirect("/");
        return;
    }

    Article.findAll({
        order: [['id', 'desc']],
        where: { categoryId: category.id },
        include: [{ model: Category }]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index.ejs', { articles, categories, home: {} });
        })
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})