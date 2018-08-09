const router = require('express').Router();

const conn = require('../config/mysql');
const config = require('../config/config');
const func = require('../config/function');

router.get('/:userId/work', function(req, res) {

});

router.post('/:userId/work', function(req, res) {

});

router.get('/:userId/work/:workId', function(req, res) {

});

router.put('/:userId/work/:workId', function(req, res) {

});

router.delete('/:userId/work/:workId', function(req, res) {

});

router.get('/:userId/work/:workId/main', function(req, res) {

});

router.post('/:userId/work/:workId/main', function(req, res) {

});

router.get('/:userId/work/:workId/main/detail', function(req, res) {

});

router.get('/:userId/work/:workId/main/calendar/:year/:month', function(req, res) {

});

router.get('/:userId/work/:workId/main/calendar/:year/:month/day', function(req, res) {

});


module.exports = router;