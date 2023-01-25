const express = require('express');
const Category = require('./Category');
const slugify = require('slugify');
const router = express.Router();

router.get("/", (req, res) => {
    Category.findAll().then(categories => {
        res.render('./../views/admin/categories/category.lis.ejs', { categories });
    })
})

router.get("/new", (req, res) => {
    res.render('../views/admin/categories/category.new.ejs');
})

router.post("/save", (req, res) => {
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

router.get("/edit/:id", (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.redirect('/categories');
    }

    Category.findByPk(id).then(category => {
        res.render('../views/admin/categories/category.edit.ejs', { category: category });
    })
})

router.post("/delete", (req, res) => {
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