function checkAuth(req, res, next) {
    const { user } = req.session;
    if (!user) {
        res.redirect("/login");
    } else {
        next();
    }
}

module.exports = checkAuth;