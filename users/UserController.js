const express = require('express');
const slugify = require('slugify');
const User = require('./user');
const router = express.Router();
const bcrypt = require('bcrypt');
const checkAuth = require('../middlewares/checkAuth');

router.get("/", checkAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('./../views/admin/users/user.list.ejs', { users });
    })
})

router.get("/new", checkAuth, (req, res) => {
    res.render('../views/admin/users/user.new.ejs');
})

router.post("/save", async (req, res) => {
    const { id, name, email, password } = req.body;

    if (!name || !email || (!id && !password)) {
        res.redirect('/users/new');
        return;
    }

    if (!id) {
        User.create({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 8)
        }).then(() => {
            res.redirect("/users");
        })
    } else {
        User.update({
            name
        }, {
            where: { id },
        }).then(() => {
            res.redirect("/users");
        })
    }

})

router.get("/edit/:id", checkAuth, (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.redirect('/users');
    }

    User.findByPk(id).then(user => {
        res.render('../views/admin/users/user.edit.ejs', { user });
    })
})

router.post("/delete", checkAuth, (req, res) => {
    const { id } = req.body;
    if (isNaN(id)) {
        res.redirect('/users')
    }

    User.destroy({
        where: { id }
    }).then(() => {
        res.redirect('/users');
    })
})

module.exports = router;