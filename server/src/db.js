import mongoose from 'mongoose';

const { connect, connection } = mongoose;

const url = process.env.DB_URL;

connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = connection;

export default db;
