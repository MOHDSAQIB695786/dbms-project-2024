const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    passkey: String
});

adminSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
    this.passkey = await bcrypt.hash(this.passkey, 10);
    next();
});

const Admin = mongoose.model('Admin', adminSchema);
const express = require('express');
const app = express();

app.post('/login', async (req, res) => {
    const { username, password, passkey } = req.body;

    // find the admin user in the database
    const admin = await Admin.findOne({ username });

    // check the password and passkey
    if (admin && await bcrypt.compare(password, admin.password) && await bcrypt.compare(passkey, admin.passkey)) {
        // password and passkey are correct, redirect to admin.html
        res.redirect('/admin.html');
    } else {
        // password or passkey is incorrect, show an error message
        res.send('Incorrect username, password, or passkey.');
    }
});
