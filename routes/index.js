var express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    res.render('home/index', {
        title: 'Expressjs skeleton'
    });
});

module.exports = router;
