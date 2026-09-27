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
import Navbar from '../../navbar.jsx';
import '../authentication.css';





export default function Register() {
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
        const email = data.get('email');
        const password = data.get('password');
        const companyname = data.get('companyname');
        const companycode = data.get('companycode');
        const role = data.get('role');
        // const cpassword=data.get('cpassword')

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/signup", {
                name,
                email,
                password,
                companyname,
                companycode,
                role
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
        <>
        <Navbar/>
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Start converting unstructured transcripts into software specs</p>
                </div>
                {/* FIX 3: Form component handles the submission */}
                <form component="form" onSubmit={handleSubmit} noValidate
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '80rem' }}>

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
                            slotProps={{
                                input: {
                                    sx: {
                                        '& ::placeholder': {
                                            color: 'black',
                                            opacity: 1, // Prevents the browser from fading the text
                                        },
                                    },
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="name" ></FormLabel>
                        <TextField
                            id="companyname"
                            name="companyname" // Important: matches data.get('name')
                            placeholder="companyname"
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    sx: {
                                        '& ::placeholder': {
                                            color: 'black',
                                            opacity: 1, // Prevents the browser from fading the text
                                        },
                                    },
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="name" ></FormLabel>
                        <TextField
                            id="companycode"
                            name="companycode" // Important: matches data.get('name')
                            placeholder="companycode"
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    sx: {
                                        '& ::placeholder': {
                                            color: 'black',
                                            opacity: 1, // Prevents the browser from fading the text
                                        },
                                    },
                                },
                            }}
                        />
                    </FormControl>
                    {/* <FormControl>
                        <FormLabel id={`role-label`}>Choose you role</FormLabel>
                        <RadioGroup
                            aria-labelledby={`role-label`}
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="Developer" control={<Radio />} label="Developer" />
                            <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
                        </RadioGroup>
                    </FormControl> */}
                    <div>
                        <input type="radio" id="manager" name="role" value="MANAGER" />
                    <label htmlFor="manager" style={{color: 'black'}}>Manager</label><br />
                    <input type="radio" id="developer" name="role" value="DEVELOPER" />
                    <label htmlFor="developer" style={{color: 'black'}}>Developer</label><br />
                    </div>
                    
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


                    <Button type="submit" fullWidth variant="contained" sx={{ marginTop: '2rem' }}>
                        Sign in
                    </Button>
                    <Divider>or</Divider>
                    <Typography sx={{ textAlign: 'center', color: 'black' }}>
                        Already have an account{' '}
                        <Link
                            href="http://localhost:5173/login"
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Sign in
                        </Link>
                    </Typography>
                </form>
            </div></div>
            </>
    );
}
