const router = require('express').Router();

router.get('/youtube/proxy/:id', require('./youtube/proxy'));

module.exports = router;
