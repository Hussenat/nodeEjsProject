const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs'); // fs means file system it removes images from where we store it locally

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/uploads');
    },
    filename: function ( req, file, cb ) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    },
});

// middleware
var upload = multer({
    storage: storage,
}).single('image');

// api or route to insert a user onto mongodb
router.post('/add', upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });

    user.save((err) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        }else {
            req.session.message = {
                type: 'success',
                message: 'user added successfully'
            };
        }
        // console.log(req.session); // it returns  message: { type: 'success', message: 'user added successfully' }
        res.redirect('/');
    });
});

// Get all users route
router.get('/', (req, res) => {
    User.find().exec((err, users) => {
        if(err){
            res.json({ message: err.message });
        }else {
            res.render('index', { title: 'Home Page', users: users});
        }
    });
});

router.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add Users' });
});

// edit user route
router.get('/edit/:id', (req, res) => {
    let id = req.params.id; // this id value is coming from the url in the browser http://localhost:5000/
    User.findById(id, (err, user) => {
        if(err){
            res.redirect('/')
        }else{
            if(user == null){
                res.redirect('/');
            }else {
                res.render('edit_users', { title: 'Edit User', user: user });
            }
        }
    })
})

// Update user route
router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename; // assign the newly selected image file name to new_image\

        try {
            fs.unlinkSync('./public/uploads/' + req.body.old_image); // to remove the old image from public/uploads folder 
        } catch (error) {
            console.log(error);
            
        }
    }else {
        new_image = req.body.old_image; // means we are not changing the old image.
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    }, ( err, result) => {
        if(err){
            res.json({ message: err.message, type: 'danger'})
        }else {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully',
            };
            res.redirect('/');
            // res.redirect(`/edit/${id}`); // here we are updating onto the edit page
        }
    });
});

// delete user route
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, result) => {
        if(result.image != ''){
            try{
                fs.unlinkSync('./public/uploads/' + result.image); // remove the image of 
            }catch (err) {
                console.log(err);
            }
        }

        if(err){
            req.json({ message: err.message })
        }else {
            req.session.message = {
                type: 'info',
                message: 'User deleted successfully',
            };
            res.redirect('/');
        }
    })
})

module.exports = router;