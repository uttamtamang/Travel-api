const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/users');
const auth = require('../routes/auth');

router.post('/signup', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user != null) {
                let err = new Error('Username already exists!');
                err.status = 401;
                return next(err);
            }

            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    throw new Error('Could not encrypt password!');
                }
                User.create({
                    username: req.body.username,
                    password: hash,
                    fullName: req.body.fullName,
                    phone: req.body.phone,
                    email: req.body.email,
                    image: req.body.image
                }).then((user) => {
                    let token = jwt.sign({ userId: user._id }, process.env.SECRET);
                    res.json({ status: "Signup Success!", token: token });
                }).catch(next);
            });
        });
});

router.post('/login', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user === null) {
                let err = new Error('User not found!');
                err.status = 401;
                return next(err);
            }
            bcrypt.compare(req.body.password, user.password, function (err, status) {
                if (!status) {
                    let err = new Error('Password does not match!');
                    err.status = 401;
                    return next(err);
                }
                let token = jwt.sign({ userId: user._id }, process.env.SECRET);
                res.json({ status: 'Login Successful!', token: token });
            });
        }).catch(next);
});

router.get('/me', auth.verifyUser, (req, res, next) => {
    // res.json({ username: req.user.username, firstName: req.user.firstName, lastName: req.user.lastName });
    res.json(req.user);
});
router.put('/me', auth.verifyUser, (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        .then((user) => {
            res.json(user);
        })
});

//OLD ROUTES

router.post('/signin', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user == null) {
                let err = new Error('User not found');
                err.status = 401;
                return next(err);
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('Password does not match');
                            err.status = 401;
                            return next(err);
                        }

                        let token = jwt.sign({ userId: user._id }, process.env.SECRET);
                        res.json({ status: 'Login successful', user: user._id, token: token });
                    }).catch(next);
            }
        }).catch(next);
});

router.get('/myProfile', auth.verifyUser, (req, res, next) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        country: req.user.country
    })
});

router.put('/myProfile', auth.verifyUser, (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        .then((user) => {
            res.json({
                _id: user._id,
                username: req.user.username,
                email: req.user.email,
                country: req.user.country
            });
        }).catch(next);

});


module.exports = router;