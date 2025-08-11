// routes/user.js
const express = require('express');
const router = express.Router(); // Use Express's Router
const User_model = require('./schema_model/schecma_model'); // Import your User 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key'; // move this to .env in real apps
const verifyToken = require('./verifytoken')




// IMPORTANT: Password Hashing Reminder
// In a real application, you'd require bcryptjs here and use it
// const bcrypt = require('bcryptjs');

// 1. Register New User (POST /api/users/register)
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields (name, email, password, phone) are required.' });
  }

  try {
    const existingUser = await User_model.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered. Please use a different email.' });

      
    }


        // const newUser = new User_model({ name, email, password, phone }); // For now, plain password

    // Hash password here in a real app:

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User_model({ name, email, password: hashedPassword, phone });



    await newUser.save();

    console.log('User registered and saved to DB:', newUser.email);

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// 2. Get All Users (GET /api/users/)
router.get('/', async (req, res) => {
  try {
    const users = await User_model.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users.', error: error.message });
  }
});

// 3. Get User by ID (GET find/:id)
router.get('/find/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User_model.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    res.status(500).json({ message: 'Server error fetching user.', error: error.message });
  }
});

// 4. Update User (PUT /api/users/:id)
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;

  
  const { name, email, password, phone } = req.body;

  if (!name && !email && !password && !phone) {
    return res.status(400).json({ message: 'No fields provided for update.' });
  }

  try {
    // If updating password, hash it here first!
    let hashedPassword
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword= await bcrypt.hash(password, salt);
    }

    const updatedUser = await User_model.findByIdAndUpdate(
      id,
      { name, email, password:hashedPassword, phone }, // Use req.body if you want to update all fields given
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log('User updated:', updatedUser.email);
    res.status(200).json({
      message: 'User updated successfully!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already in use by another user.' });
    }
    res.status(500).json({ message: 'Server error updating user.', error: error.message });
  }
});

// 5. Delete User (DELETE /api/users/:id)
router.delete('/delete', async (req, res) => {
    
  try {
    const { id } = req.body;
    console.log(id);
    
    const deletedUser = await User_model.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log('User deleted:', deletedUser.email);
    res.status(200).json({ message: 'User deleted successfully!', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    res.status(500).json({ message: 'Server error deleting user.', error: error.message });
  }
});

//login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User_model.findOne({ email });

    // 2. If user not found
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 4. Create JWT token (valid for 5 minutes)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5. Set token in httpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        // secure: true, // uncomment this in production or if using https locally
        sameSite: 'Lax', // or 'None' if using secure: true and truly cross-site
        maxAge: 3600000
      });


    // 6. Send user info without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

router.get('/details', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user info found' });
    }

    // Get email from decoded JWT payload
    const { email } = req.user;

    // Fetch user by email
    const user = await User_model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Respond with user data
    res.status(200).json({
      message: 'This is protected data',
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Error in /details route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





module.exports = router;