const express = require('express');
const Category = require('./Category');
const slugify = require('slugify');
const checkAuth = require('../middlewares/checkAuth');
const router = express.Router();

router.get("/", checkAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('./../views/admin/categories/category.list.ejs', { categories });
    })
})

router.get("/new", checkAuth, (req, res) => {
    res.render('../views/admin/categories/category.new.ejs');
})

router.post("/save", checkAuth, (req, res) => {
    const { id, title } = req.body;
    if (!title) {
        res.redirect('/categories/category.new.ejs');
        return;
    }

    Category.upsert({
        id: id,
        title: title,
        slug: slugify(title)
    }).then(() => {
        res.redirect("/categories");
    })

})

router.get("/edit/:id", checkAuth, (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.redirect('/categories');
    }

    Category.findByPk(id).then(category => {
        res.render('../views/admin/categories/category.edit.ejs', { category: category });
    })
})

router.post("/delete", checkAuth, (req, res) => {
    const { id } = req.body;
    if (isNaN(id)) {
        res.redirect('/categories')
    }

    Category.destroy({
        where: { id }
    }).then(() => {
        res.redirect('/categories');
    })
})

module.exports = router;