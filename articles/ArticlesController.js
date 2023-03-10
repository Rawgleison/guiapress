const express = require('express');
const Category = require('../categories/Category');
const Article = require('./Article');
const { default: slugify } = require('slugify');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();

router.get("/", checkAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        res.render('../views/admin/articles/article.list.ejs', { articles });
    }).catch(() => {
        res.redirect("/");
    })
})

router.get("/new", checkAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('./../views/admin/articles/article.new.ejs', { categories: categories });
    }).catch(() => {
        res.redirect("/");
    })
})

router.post("/delete", checkAuth, (req, res) => {
    const { id } = req.body;
    if (isNaN(id)) {
        res.redirect('/articles')
    }

    Article.destroy({
        where: { id }
    }).then(() => {
        res.redirect('/articles');
    })
})

router.get("/edit/:id", checkAuth, (req, res) => {
    const { id } = req.params;
    Article.findOne({ where: { id }, include: [{ model: Category }] }).then(article => {
        if (!article) {
            res.redirect("/");
        }

        Category.findAll().then(categories => {
            res.render("../views/admin/articles/article.edit.ejs", { article, categories });
        })
    }).catch(() => {
        res.redirect("/");
    })
})

router.get("/article/:slug", checkAuth, (req, res) => {
    const { slug } = req.params;
    Article.findOne({ where: { slug }, include: [{ model: Category }] }).then(article => {
        if (!article) {
            res.redirect("/");
        }
        res.render("../views/article.ejs", { article });
    }).catch(() => {
        res.redirect("/");
    })
})

router.post("/save", checkAuth, (req, res) => {
    const { id, title, body, categoryId } = req.body;

    Article.upsert({
        id: id,
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: categoryId
    }).then(() => {
        res.redirect("/articles")
    })
})

module.exports = router;