import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Login } from 'features/login';
import { ConversationsApp } from 'features/conversations-app';
import { LOADING } from 'constants';
import { FriendlyNameInput } from 'features/friendly-name-input';
import { getConversationsToken } from './store/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const { token, status, user } = useSelector((state) => state.auth);

  const { email = '' } = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    if (email.length) {
      dispatch(getConversationsToken(email));
    }
  }, []);

  if (!email || (!token && status !== LOADING)) {
    return <Login />;
  }

  if (status === LOADING) {
    return (
      <div>Loading...</div>
    );
  }

  if (user.name === undefined) {
    return <FriendlyNameInput />;
  }

  return (
    <ConversationsApp />
  );
}
