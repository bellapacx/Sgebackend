import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/users';
import jwt from 'jsonwebtoken';
import authenticateToken from '../middleware/authMiddleware'; // Import the JWT middleware

const router = express.Router();
const secretKey = '9f8c6d8b2a5e3b1f4e9d7a9b3c2a7d6e4f8b1c0d6e7f8a9b0c1d2e3f4g5h6i7j'; // Ensure this key is stored securely and not hard-coded

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
    const { username, password, phone_number, role, store_id } = req.body;
    console.log('Request body:', req.body); // Log the incoming request data

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Check if password is valid
        if (!password || typeof password !== 'string' || password.trim() === '') {
            throw new Error('Invalid password');
        }

        // Hash the password before saving
        const saltRounds = 10; // Number of salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Ensure both arguments are passed

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            phone_number,
            role,
            store_id, // Store as string
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Registration error:', error.message); // Log the error message
            console.error('Stack trace:', error.stack); // Log the stack trace
            res.status(500).json({ error: 'An error occurred while registering the user' });
        } else {
            console.error('Unknown error:', error); // Handle unexpected error types
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ username: user.username, role: user.role, store_id: user.store_id }, secretKey, { expiresIn: '1h' });

        // Successful login
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

// Logout user (JWT doesn't have a logout mechanism as such; just remove the token on the client-side)

// Get current user
router.get('/current-user', authenticateToken, (req: Request, res: Response) => {
    if ((req as any).user) {
        res.status(200).json((req as any).user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Get all users
router.get('/users', authenticateToken, async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('username phone_number role store_id created_at').populate('store_id');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
});

// Get a single user by ID
router.get('/users/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('username phone_number role store_id created_at').populate('store_id');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the user' });
    }
});

export default router;
