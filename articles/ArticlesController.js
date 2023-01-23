const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Lista de categorias");
})

router.get("/new", (req, res) => {
    res.send("nova categosria");
})

module.exports = router;