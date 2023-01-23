const express = require('express');
const Category = require('./Category');
const slugify = require('slugify');
const router = express.Router();

router.get("/", (req, res) => {
    Category.findAll().then(categories => {
        res.render('./../views/admin/categories', { categories });
    })
})

router.get("/new", (req, res) => {
    console.log(req.body);
    res.render('../views/admin/categories/new.ejs');
})

router.post("/save", (req, res) => {
    const { title } = req.body;
    if (!title) {
        res.redirect('/categories/new');
    }
    Category.create({
        title: title,
        slug: slugify(title)
    }).then(() => {
        res.redirect("/");
    })
})

module.exports = router;