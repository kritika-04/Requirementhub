import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
// import { useNavigate } from "react-router";
import axios from 'axios';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import api from '../../axios.js';
// import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import '../authentication.css';
import Navbar from '../../navbar.jsx';

export default function Login () {
  // const [formData, setFormData] = useState({ username: '', password: '' });
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');
  // const navigate = useNavigate();

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     // Connect your Django JWT login API here:
  //     // const res = await api.post('/token/', formData);
  //     console.log('Logging in with:', formData);
      
  //     setTimeout(() => {
  //       setLoading(false);
  //       // navigate('/dashboard');
  //     }, 1000);
  //   } catch (err) {
  //     setLoading(false);
  //     setError('Invalid username or password.');
  //   }
  // };
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const navigate = useNavigate();

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    if (!email.value || email.value.length < 2) {
      setEmailError(true);
      setEmailErrorMessage('Email is required.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 4) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 4 characters.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); // FIX 1: Prevents page refresh/Network Error
    console.log("clicked")
    if (!validateInputs()) return;
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    try {
      const response = await api.post("login", {
        email,
        password
      });

      console.log("Login response:", response.data);

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/profile");
      // window.location.reload()

    } catch (err) {
      console.log("Login failed", err.response?.data);
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("MESSAGE:", err.message);
    }
  };

  return (<>
    <Navbar/>
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your requirement intelligence workspace</p>
        </div>

        {/* {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-field">
              <User size={16} className="icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="dev_lead"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-field">
              <Lock size={16} className="icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form> */}
        <form component="form" onSubmit={handleSubmit} noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '34rem' }}>


          <FormControl >
            <FormLabel htmlFor="email" ></FormLabel>
            <TextField 
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              className="inputfield"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
            />

          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password" sx={{ margin: '2rem' }}></FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              placeholder='.....'
              name="password"
              type="password"
              id="password"
              className="inputfield"
              required
              fullWidth
            />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" sx={{ marginTop: '2rem' }}>
            Sign in
          </Button>
          <Divider>or</Divider>
          <Typography sx={{ textAlign: 'center' , color: 'black'}}>
            Don&apos;t have an account?{' '}
            <Link
              href="http://localhost:5173/register"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign up
            </Link>
          </Typography>
        </form>

        {/* <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div> */}

        <div className="security-tag">
          {/* <ShieldCheck size={14} /> Secured with HTTP-only Cookie JWT */}
        </div>
      </div>
    </div>
  </>);
};