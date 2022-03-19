import { Router } from 'express';
import { genSalt, hash, compare } from 'bcrypt';
import Twilio from 'twilio';
import dotenv from 'dotenv';
import User from './userModel';

dotenv.config();

const { jwt } = Twilio;

const accountSid = process.env.TWILIO_ACCCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const chatServiceSid = process.env.TWILIO_CHAT_SERVICE_SID;
const fcmCredentialSid = process.env.TWILIO_FCM_CREDENTIAL_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;

const client = new Twilio(accountSid, authToken);

const router = Router();

const generateChatToken = (identity) => {
  const { ChatGrant } = jwt.AccessToken;
  const chatGrant = new ChatGrant({
    serviceSid: chatServiceSid,
    pushCredentialSid: fcmCredentialSid,
  });

  const ttl = '21600000';
  const token = new jwt.AccessToken(
    accountSid,
    apiKey,
    apiSecret,
    { identity, ttl },
  );

  token.addGrant(chatGrant);
  const chatToken = token.toJwt();
  return chatToken;
};

const createConversationsUser = async (identity, email) => {
  const attributes = JSON.stringify({ email });
  const friendlyName = email;

  try {
    const user = await client.conversations.users.create({
      identity,
      friendlyName,
      attributes,
    });
    return user;
  } catch (error) {
    console.log(`Error occured while creating new conversations user: ${error}`);
    return null;
  }
};

const updateConversationsUser = async (identity, friendlyName) => {
  try {
    const user = await client.conversations.users(identity)
      .update({ friendlyName });
    return user;
  } catch (error) {
    console.log(`Error occured while updating conversations user: ${error}`);
    return null;
  }
};

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

    const conversationsUser = await createConversationsUser(user.id, email);
    if (!conversationsUser) {
      console.log('Failed to create conversations user');
    }

    const token = generateChatToken(user.id);
    return res.status(201).json({
      message: 'User created successfully.',
      response: {
        name: user.name,
        email: user.email,
        id: user.id,
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
      return res.status(404).json({
        message: 'The email address or password you entered is incorrect',
      });
    }
    const isPasswordValid = compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(403).json({
        message: 'The email address or password you entered is incorrect',
      });
    }

    const token = generateChatToken(foundUser.id);

    return res.status(200).json({
      message: 'Logged in successfully.',
      response: {
        token,
        name: foundUser.name,
        email: foundUser.email,
        id: foundUser.id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { email, name } = req.body;

    let foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({
        message: 'User with this email not found',
      });
    }

    const updatedUser = await updateConversationsUser(foundUser.id, name);
    if (!updatedUser) {
      console.log('Failed to update conversations user');
    }

    foundUser.name = name;
    foundUser = await foundUser.save();

    return res.status(200).json({
      message: 'User update successful',
      response: {
        name: foundUser.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({
        message: 'Incorrect email or password!',
      });
    }
    const token = generateChatToken(foundUser.id);

    return res.status(200).json({
      message: 'Logged in successfully.',
      response: {
        token,
        name: foundUser.name,
        email: foundUser.email,
        id: foundUser.id,
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
