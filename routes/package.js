const express = require('express');
const package = require('../models/package');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('./auth');
const Package = require('../models/package')

//Your initial routes
router.post('/addpackage', function (req, res) {
    console.log(req.body);
    const mydata = new package(req.body)
    mydata.save().then(function () {
        res.send('package is sucessfully added')
    }).catch(function (e) {
        res.send(e)

    })
})
router.put('/updatepackage/:packageid', function (req, res) {
    package.findOneAndUpdate({ _id: req.params.packageid }, req.body).then(function () {
        res.send("Package is updated")
    }).catch(function () {
        res.send("error")
    })
})

router.delete('/deletepackage/:packageid', function (req, res) {
    console.log(req.params.packageid);
    package.findByIdAndDelete(req.params.showid).then(function () {
        res.send("package is deleted")
    }).catch(function () {
        res.send(e)
    })
})
router.get('/selectpackage/:packageid', function (req, res) {
    package.findById(req.params.packageid).then(function (user_data) {

        res.send(user_data);
        console.log(req.body)
        req.send("package is selected")
    }).catch(function (e) {
        res.send("error")
    })


})


//NEW ROUTES
router.route('/')
    .get((req, res, next) => {
        Package.find()
            .then(pkg => {
                res.json(pkg);
            })
    })
    .post(auth.verifyUser, (req, res, next) => {
        let pkg = new Package(req.body);
        pkg.tAgency = req.user._id;
        pkg.save()
            .then(pkg => {
                res.statusCode = 201;
                res.json(pkg);
            }).catch(next)
    })
    .put((req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Package.deleteMany()
            .then(response => {
                res.json(response);
            })
            .catch(next);
    })

router.route("/myPackage")
    .get(auth.verifyUser, (req, res, next) => {
        Package.find({ tAgency: req.user._id })
            .populate({
                path: 'tAgency'
            })
            .then((songs) => {
                res.json(songs);
            })
    })

router.route("/:id")
    .get((req, res, next) => {
        Package.findOne({ _id: req.params.id })
            .then(song => {
                res.json(song);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed." });
    })

    .put(auth.verifyUser, (req, res, next) => {
        Package.findOneAndUpdate(
            { tAgency: req.user._id, _id: req.params.id },
            { $set: req.body },
            { new: true }
        )
            .populate({
                path: 'tAgency'
            })
            .then(reply => {
                res.json(reply);
            })
            .catch(next);
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Package.findOneAndDelete({ tAgency: req.user._id, _id: req.params.id })
            .populate({
                path: 'tAgency'
            })
            .then(response => {
                res.json(response);
            })
            .catch(next);
    });

module.exports = router;