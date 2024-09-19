const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('express-flash-notification');
const cookieParser = require('cookie-parser');
const multer = require('multer');

require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a schema for the user model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);

// Create a schema for the admin model
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    passkey: String
});
// adminSchema.pre('save', async function(next) {
//     this.password = await bcrypt.hash(this.password, 10);
//     this.passkey = await bcrypt.hash(this.passkey, 10);
//     next();
// });
const Admin = mongoose.model('Admin', adminSchema);

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add session management middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600 }
}));

app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/user');
  }
  res.sendFile(path.join(__dirname, 'public', 'mainpage.html'));
});

// Route to handle user signup
app.post('/signup', async (req, res) => {
  if (req.session.userId) {
    return res.send('You are already logged in. Please log out to create a new account.');
  }

  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Automatically log in the new user after signup
    req.session.userId = newUser._id;

    res.send('Signup successful. You are now logged in.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during signup');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  if (req.session.userId) {
    return res.send('You are already logged in.');
  }
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      return res.redirect('/user'); // Redirect to /user route
    } else {
      res.status(401).send('Invalid credentials. Please sign up if you do not have an account.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during login');
  }
});

// Route to handle admin signup
app.post('/adminsignup', async (req, res) => {
  const { username, password, passkey } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).send('Admin already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPasskey = await bcrypt.hash(passkey, 10);
    const newAdmin = new Admin({ username, password: hashedPassword, passkey: hashedPasskey });
    await newAdmin.save();
    res.send('Admin signup successful.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during admin signup');
  }
});
 
// Admin Login Route
app.post('/adminlogin', async (req, res) => {
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

// User Route (Protected)
app.get('/user', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }
  // Serve the user page or user data
  res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// admin add items to canteen 


const canteen1Schema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    quantity: Number
});
const Canteen1 = mongoose.model('Canteen1', canteen1Schema);

const canteen2Schema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    quantity: Number
});
const Canteen2 = mongoose.model('Canteen2', canteen2Schema);

const canteen3Schema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    quantity: Number
});
const Canteen3 = mongoose.model('Canteen3', canteen3Schema);

const canteen4Schema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    quantity: Number
});
const Canteen4 = mongoose.model('Canteen4', canteen4Schema);



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads')); // Destination folder
  },
  filename: function (req, file, cb) {
      // Generate a unique filename (you can customize this logic)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/addItem', upload.single('imageFile'), async (req, res) => {
    const { title, price, quantity, canteen, imageUrl } = req.body;
    let image;

    // If an image file was uploaded, use it. Otherwise, use the image URL.
    if (req.file) {
      image = '/uploads/' + req.file.filename;
  } else {
      image = imageUrl;
  }
  

    let newItem;
    switch(canteen) {
        case '1':
            newItem = new Canteen1({ title, image, price, quantity });
            break;
        case '2':
            newItem = new Canteen2({ title, image, price, quantity });
            break;
        case '3':
            newItem = new Canteen3({ title, image, price, quantity });
            break;
        case '4':
            newItem = new Canteen4({ title, image, price, quantity });
            break;
        default:
            return res.status(400).send('Invalid canteen number');
    }

    try {
        await newItem.save();
        res.status(200).send(`Item added to Canteen ${canteen} successfully`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding item');
    }
});
;

let items = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getItems', async (req, res) => {
  try {
      const items = await Canteen1.find(); // Fetch items from Canteen1
      res.json(items);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching items');
  }
});
app.get('/getItems2', async (req, res) => {
  try {
      const items = await Canteen2.find(); // Fetch items from Canteen1
      res.json(items);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching items');
  }
});
app.get('/getItems', async (req, res) => {
  try {
      const items = await Canteen3.find(); // Fetch items from Canteen1
      res.json(items);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching items');
  }
});app.get('/getItems', async (req, res) => {
  try {
      const items = await Canteen4.find(); // Fetch items from Canteen4
      res.json(items);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching items');
  }
});

// Endpoint to add item
app.post('/addItem', upload.single('imageFile'), (req, res) => {
    const newItem = {
        title: req.body.title,
        imageUrl: req.body.imageUrl || req.file.path, // Use uploaded file path if no imageUrl is provided
        price: req.body.price,
        qty: req.body.qty,
        canteen: req.body.canteen
    };
    items.push(newItem);
    res.redirect('/'); // Redirect to homepage after adding item
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
