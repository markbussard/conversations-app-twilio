import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './userModel';
import authRouter from './authRouter';
import db from './db';

dotenv.config();

const privateKey = process.env.JWT_KEY;

// eslint-disable-next-line consistent-return
const verifyAuthentication = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(' ')[1];
    const decoded = jwt.verify(token, privateKey);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        message: 'Failed to authenticate user',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error while trying to authenticate user: ', error);
    res.status(401).json({
      message: 'Failed to authenticate user',
      error: error.message,
    });
  }
};

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server successfully contacted',
  });
});

app.use('/auth', authRouter);
app.use(verifyAuthentication);

db.on('err', console.error.bind(console, 'MongoDB connection error'));
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
