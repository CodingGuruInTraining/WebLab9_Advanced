var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {
        req.db.collection('travel').find().toArray(function (err, docs) {
            if (err) {
                return next(err)
            }
            return res.render('index', {title: 'Travel Wish List'});
        });
});

/* GET all items home page. */
router.get('/all', function(req, res, next) {
    req.db.collection('travel').find().toArray(function (err, docs) {
        if (err) {
            return next(err)
        }
        res.json(docs);
    });
});

/* POST - add a new location */
router.post('/add', function(req, res) {
    var name = req.body.name;
    var place = {'name': name, 'visited': false };
    req.db.collection('travel').insertOne(place, function(err) {
        if(err) {
            return next(err)
        }
        res.status(201);
        return res.json(place);
    });
});

/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res){
    var id = req.body.id;
    var newPlace = {$set: {visited: "true"}};  // all the body parameters are strings
    req.db.collection('travel').findOneAndUpdate({_id: ObjectID(id)}, newPlace, function(err, doc) {
            if(err) {
                return next(err);
            }
            return res.json({'id' : id});
        }
    );
});

// DELETE route.
router.delete('/delete', function(req, res){
    var place_id = req.body.id;
    req.db.collection('travel').deleteOne({_id : ObjectID(place_id)}, function(err) {
        if(err) {
            return next(err);
        }
        res.status(200);
        return res.json({'id' : place_id});
    });

});
module.exports = router;
