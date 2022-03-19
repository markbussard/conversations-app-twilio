import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './authRouter';
import db from './db';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server successfully contacted',
  });
});

app.use('/auth', authRouter);

db.on('err', console.error.bind(console, 'MongoDB connection error'));
const port = process.env.PORT || 1235;
app.listen(port, () => console.log(`Listening on port ${port}`));
