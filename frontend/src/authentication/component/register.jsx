import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router";
import axios from 'axios';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';

// const Card = styled(MuiCard)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignSelf: 'center',
//   width: '100%',
//   padding: theme.spacing(4),
//   gap: theme.spacing(2),
//   margin: 'auto',
//   [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
// }));
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

// const SignInContainer = styled(Stack)(({ theme }) => ({
//   minHeight: '100dvh',
//   padding: theme.spacing(4),
//   justifyContent: 'center'
// }));
const SignInContainer = styled(Stack)(({ theme }) => ({
//   height: 'calc((1 - var(--template-frame-height, 0.1)) * 100dvh)',
  height:'40rem',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Login() {
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  
  const navigate = useNavigate();

  const validateInputs = () => {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    // const cpassword = document.getElementById('cpassword');
    let isValid = true;

    if (!name.value || name.value.length < 2) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
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
    
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const email=data.get('email');
    const password = data.get('password');
    // const cpassword=data.get('cpassword')

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/signup", {
        name, 
        email,
        password
      });

    //   localStorage.setItem("access_token", res.data.access_token);
      alert("Register Successfully");
      navigate('/login'); 
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      alert("Login Failed: Check credentials");
    }
  };

  return (
    
    <SignInContainer>
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ width: '35%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' , fontFamily:'Times New Roman', fontWeight:700}}>Join us</Typography>
        
        {/* FIX 3: Form component handles the submission */}
        <Box component="form" onSubmit={handleSubmit} noValidate 
          sx={{ display: 'flex', flexDirection: 'column', gap: 2,  height:'80rem'}}>
          
          <FormControl>
            <FormLabel htmlFor="name" ></FormLabel>
            <TextField
              error={nameError}
              helperText={nameErrorMessage}
              id="name"
              name="name" // Important: matches data.get('name')
              placeholder="Name"
              required
              fullWidth
            />
          </FormControl>
          <FormControl>
               <FormLabel htmlFor="email" ></FormLabel>
               <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
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
            <FormLabel htmlFor="password"></FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              placeholder="Password"
              name="password"
              type="password"
              id="password"
              required
              fullWidth
            />
          </FormControl>
          

          <Button type="submit" fullWidth variant="contained" sx={{marginTop:'2rem'}}>
            Sign in
          </Button>
          <Divider>or</Divider>
             <Typography sx={{ textAlign: 'center' }}>
               Already have an account{' '}
               <Link
                href="http://localhost:5173/login"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
