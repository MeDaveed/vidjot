const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const router = express.Router();

//load user model
require('../models/User');
const User = mongoose.model('users');

//User Login Route
router.get('/login', (req, res) => {
    res.render('users/login')
})

//User Register Route
router.get('/register', (req, res) => {
    res.render('users/register')
})

//Login form post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//Register form post
router.post('/register', (req, res) => {
    let errors = [];
    if (!req.body.name) {
        errors.push({
            text: 'Please enter your name'
        })
    }
    if (!req.body.email) {
        errors.push({
            text: 'Please enter your email'
        })
    }
    if (!req.body.password) {
        errors.push({
            text: 'Please enter a password'
        })
    }
    if (req.body.password !== req.body.password2) {
        errors.push({
            text: 'passwords don\'t match'
        })
    }
    if (req.body.password.length < 4) {
        errors.push({
            text: 'password must be at least 4 characters',
        })
    }
    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }else{
        User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register')
                }else{
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                        })
                    })

                    new User(newUser)
                        .save()
                        .then(user => {
                            req.flash('success_msg', 'You are now a registered user')
                            res.redirect('/users/login')
                        })
                        .catch(err => {
                            console.log(err);
                            return;
                        })
                }
            })
    }
})


module.exports = router;