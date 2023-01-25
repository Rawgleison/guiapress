const express = require('express');
const slugify = require('slugify');
const User = require('./user');
const router = express.Router();

router.get("/", (req, res) => {
    User.findAll().then(users => {
        res.render('./../views/admin/users/user.list.ejs', { users });
    })
})

router.get("/new", (req, res) => {
    res.render('../views/admin/users/user.new.ejs');
})

router.post("/save", (req, res) => {
    const { id, name, email, password } = req.body;
    if (!name || !email || !password) {
        res.redirect('/users/new');
        return;
    }

    User.upsert({
        id: id,
        name: name,
        email: email,
        password: password
    }).then(() => {
        res.redirect("/users");
    })

})

router.get("/edit/:id", (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.redirect('/users');
    }

    user.findByPk(id).then(user => {
        res.render('../views/admin/users/user.edit.ejs', { user: user });
    })
})

router.post("/delete", (req, res) => {
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