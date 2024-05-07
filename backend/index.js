const express = require('express');
const validator = require('validator');
const User = require('./models/User');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Check that all fields have been supplied
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are mandatory.' });
    }

    // Check if the email is valid
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'The email provided is not valid.' });
    }

    // Check that the password meets the minimum requirements
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one uppercase letter.' });
    }

    if (!/[a-z]/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one lowercase letter.' });
    }

    if (!/\d/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one number.' });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one special character.' });
    }

    try {
        // Check if the email is already in use
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'This email is already in use.' });
        }

        // If the email is not in use, create a new user account in the database
        const newUser = new User({ name, email, password });
        await newUser.save();

        return res.json({ message: 'User account successfully created!' });
    } catch (error) {
        console.error('Error creating user account:', error);
        return res.status(500).json({ message: 'Internal server error. Please try again.' });
    }
});

// Function to validate the e-mail
function isValidEmail(email) {
    return validator.isEmail(email);
}
