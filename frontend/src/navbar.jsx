import react, { useState, useEffect } from 'react';
import api from '../src/axios.js';
import { FormControl, FormLabel, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

export default function Navbar(){
    const [Username,setUsername]=useState('');
    const [Userid,setUserid]=useState('');
    const navigate=useNavigate();
    useEffect(()=>{
        api.get("profile")
        .then(res => {
            console.log(res.data)
            setUsername(res.data.name)
            // setUserEmail(res.data.email)
            // setUserrole(res.data.role)
            // setUserstatus(res.data.status)
            setUserid(res.data.id)
            // setUserCompany(res.data.company)
            // setUserCompanyid(res.data.companyid)
        })
        .catch(err => console.log(err))
    },[])
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        alert("Logged out successfully");
        navigate("/login");
    };
    return(
    <>
        <header className="navbar">
        <Link to="/" className="brand">
          <div className="logo-icon">⚡</div>
          <span className="brand-name">Requirement Hub</span>
        </Link>
        {Userid && (
            <div className="nav-actions">
                <Link to="/profile" className="nav-link">Profile</Link>
                <button className="btn-nav" onClick={logout}>
                    Logout
                </button>
            </div>
        )}
        {!Userid && (
            <div className="nav-actions">
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/register" className="btn-nav">Get Started</Link>
        </div>
        )}
        
        
      </header>
    </>
    )
}