const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")

mongoose.connect('mongodb+srv://Dhairya:Dhairya432r@cluster0.kad7z2w.mongodb.net/mongo2?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`successfully connected to db`)
}).catch((err) => console.log(`failed to connect db`));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    picture: String,
    tokens: [String] // Add an array field to store JWT tokens
});

const User = mongoose.model('User', userSchema);
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Replace this with your frontend's domain
    credentials: true,
  }));  
  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});
app.use(express.json());

app.post('/api/user', async (req, res) => {
    const { name, email, picture } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // If the user doesn't exist, create a new user with an initial token
            const token = jwt.sign({ email }, 'MYNAMEISDHAIRYA', { expiresIn: '1h' });
            user = new User({ name, email, picture, tokens: [token] });
            await user.save();
        } else {
            // If the user already exists, add a new token to the tokens array
            const token = jwt.sign({ email }, 'MYNAMEISDHAIRYA', { expiresIn: '1h' });
            user.tokens.push(token);
            await user.save();
        }
        res.cookie('jwt', user.tokens[user.tokens.length - 1], {
            httpOnly: true,
            maxAge: 3600000, // Expires in 1 hour (in milliseconds)
            sameSite: 'lax', // Change this according to your security requirements
            secure: process.env.NODE_ENV === 'production' // Set to true in production for HTTPS
        });
       
        res.status(201).json({ message: 'User data saved successfully', tokens: user.tokens });
    } catch (error) {
        res.status(500).json({ error: 'Error saving user data' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
