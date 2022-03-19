import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, CircularProgress, Link, Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'components/Button';
import { TextField } from 'components/TextField';
import { loginUser, registerUser } from 'store/slices/authSlice';
import { FAILED, LOADING } from 'constants';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({});
  const [isLoginForm, setIsLoginForm] = useState(true);

  useEffect(() => {
    if (status === FAILED) {
      toast.error("This didn't work", { duration: 5000 });
    }
  }, [status]);

  const handleLink = useCallback(() => {
    setIsLoginForm((prev) => !prev);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginForm) {
      dispatch(loginUser(formData));
    } else {
      dispatch(registerUser(formData));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box className="login-container" sx={{ height: '100%', backgroundColor: '#fff' }}>
      <Box
        className="login-content"
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
        {
        isLoginForm
          ? <Typography variant="h5">Login to your account</Typography>
          : <Typography variant="h5">Create a new account</Typography>
        }
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
            label="Email"
            name="email"
          />
          <TextField
            sx={{ width: '100%', margin: '1rem 0' }}
            variant="outlined"
            size="small"
            name="password"
            label="Password"
            type="password"
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
              {isLoginForm ? 'Login' : 'Register'}
            </Button>
          </Box>
        </Box>
        {
          isLoginForm
            ? (
              <Box sx={{ marginTop: '24px' }} textAlign="center">
                {'Don\'t have an account? '}
                <Link sx={{ cursor: 'pointer' }} onClick={handleLink}>Create one</Link>
              </Box>
            ) : (
              <Box sx={{ marginTop: '24px' }} textAlign="center">
                {'Already registered? '}
                <Link sx={{ cursor: 'pointer' }} onClick={handleLink}>Sign in</Link>
              </Box>
            )
        }
      </Box>
    </Box>
  );
};

export default Login;
