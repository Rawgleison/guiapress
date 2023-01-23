const express = require('express');
const router = express.Router();

router.get("/new", (req, res) => {
    res.render('../views/admin/categories/new.ejs');
})

router.post("/save", (req, res) => {
    console.log(req.body.title);
    res.render('../views/admin/categories/new.ejs', { success: true });
})

module.exports = router;