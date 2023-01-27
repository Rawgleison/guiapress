const express = require('express');
const bodyParser = require('body-parser')
const connection = require('./database/database');
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');
const session = require('express-session')
const bcrypt = require('bcrypt');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/user');
const router = require('./users/UserController');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: "jhjhjg%¨65hggh65hc65y7&¨&jhj",
    cookie: {
        maxAge: 60000
    }
}))
app.use((req, res, next) => {
    const { user } = req.session;
    res.locals.user = user;
    next();
})

connection.authenticate()
    .then(() => {
        console.log("Database connected successful");
    })
    .catch((error) => {
        console.log(error);
    });

app.use("/categories", categoriesController);
app.use("/articles", articlesController);
app.use("/users", usersController);

app.get('/', (req, res) => {
    res.redirect("home/1")
})

app.get('/category/:SlugCategory', async (req, res) => {
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

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.post("/auth", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.render("login.ejs", { msg: "Usuário ou senha não informado." });
    }

    User.findOne({ where: { email } }).then(async user => {
        if (!user) {
            res.render("login.ejs", { msg: "Usuário ou senha incorreto." });
        } else {
            const valid = await bcrypt.compare(password, user.password);

            if (valid) {
                const userAuth = {
                    name: user.name,
                    email: user.email
                }
                req.session.user = userAuth;
                // res.json(userAuth);
                res.redirect("/");
            } else {
                res.locals.msg = "Usuário ou senha incorretos.";
                res.render("login.ejs", { msg });
            }
        }
    })
})

app.get("/home/:page", (req, res) => {
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

app.get("/logoff", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})