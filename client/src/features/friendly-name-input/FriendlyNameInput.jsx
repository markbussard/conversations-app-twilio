import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, CircularProgress, Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'components/Button';
import { TextField } from 'components/TextField';
import { FAILED, LOADING } from 'constants';
import toast from 'react-hot-toast';
import { updateUserFriendlyName } from 'store/slices/authSlice';

const FriendlyNameInput = () => {
  const dispatch = useDispatch();
  const { status, user } = useSelector((state) => state.auth);

  const [name, setName] = useState('');

  useEffect(() => {
    if (status === FAILED) {
      toast.error("This didn't work", { duration: 5000 });
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserFriendlyName({ email: user.email, name }));
  };

  const handleChange = useCallback((e) => {
    const { value } = e.target;
    setName(value);
  }, []);

  return (
    <Box
      className="friendly-name-input-container"
      sx={{ height: '100%', backgroundColor: '#fff' }}
    >
      <Box
        className="friendly-name-content"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 3
        }}
      >
        <Typography variant="h5">Enter a username</Typography>
        <Box
          component="form"
          id="login-form"
          autoComplete="off"
          sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
          onChange={handleChange}
          onSubmit={handleSubmit}
        >
          <TextField
            sx={{ width: '100%', margin: '1rem 0' }}
            variant="outlined"
            size="small"
            label="Username"
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              sx={{ margin: '0 auto' }}
              variant="contained"
              type="submit"
              disabled={status === LOADING}
              startIcon={(status === LOADING) ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FriendlyNameInput;
