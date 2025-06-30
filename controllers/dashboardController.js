exports.dashboard = (req, res) => {
    const successMsg = req.query.success || null;
    return res.render('dashboard', { user: req.user, email: req.user.email, error: null, successMsg });
}