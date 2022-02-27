import { Router } from 'express';
import { genSalt, hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './userModel';

const privateKey = process.env.JWT_KEY;

const router = Router();

const generateAuthToken = (id) => jwt.sign(
  { _id: id },
  privateKey,
  { expiresIn: '24h' },
);

router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({
        message: 'User with this email already exists.',
      });
    }
    let user = await new User(req.body);
    const salt = await genSalt(10);

    user.password = await hash(user.password, salt);
    user = await user.save();

    const token = generateAuthToken(user._id);
    return res.status(201).json({
      message: 'User created successfully.',
      response: {
        name: user.name,
        email: user.email,
        _id: user._id,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(403).json({
        message: 'Incorrect email or password!',
      });
    }
    const isPasswordValid = compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message: 'Incorrect email or password.',
      });
    }

    const token = generateAuthToken(foundUser._id);

    return res.status(200).json({
      message: 'Logged in successfully.',
      response: {
        token,
        name: foundUser.name,
        email: foundUser.email,
        _id: foundUser._id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
});

export default router;
