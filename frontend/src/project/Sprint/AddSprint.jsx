import React from "react";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import api from '../../axios'
import Navbar from '../../navbar.jsx'
import { useNavigate } from "react-router-dom";
// import {usequeryparams} from 'react-router-dom'
import { useParams } from "react-router-dom";
//pid=projectid
export default function AddSprint(){
    const navigate = useNavigate();
    const [name, setname] = useState('');
    const [goal, setgoal] = useState('');
    const projectid=useParams().projectid;
    const [Username, setUsername] = useState('');
    const [Userid, setUserid] = useState('');
    const [Userrole, setUserrole] = useState('');
   
    useEffect(()=>{
        api.get("profile")
        .then(res => {
            console.log(res.data)
            setUsername(res.data.name)
            setUserid(res.data.id)
            setUserrole(res.data.role)
        })
        .catch(err => console.log(err))
    },[])

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        try{
            const response=await api.post(`${projectid}/addsprint`, { name, goal ,userid: Userid, start_date: data.get('start-date'), end_date: data.get('end-date') });
            // navigate(`/project/${projectid}`);
            console.log("Sprint added successfully:", response.data);
            alert("Sprint added successfully!");
            navigate(`/project/${projectid}`);
        } catch (error) {
            console.error('Error adding sprint:', error);
        }
    }
    
    return (
    <>
        <Navbar/>
        <Box sx={{ width: '100%' }}>
            <form style={{display:'flex', flexDirection:'column', gap:'1rem', padding:'1rem', border:'1px solid black', borderRadius:'0.5rem'}} method="post" component="form" onSubmit={handleSubmit}>
                <TextField id="name" label="Name of sprint" variant="outlined" onChange={(e) => setname(e.target.value)} />
                <TextField id="goal" label="Goal of sprint" variant="outlined" onChange={(e) => setgoal(e.target.value)} />
                <input type="datetime-local" id="start-date" name="start-date" />
                <input type="datetime-local" id="end-date" name="end-date" />
                <button type="submit" variant="contained" color="primary">Submit</button>
            </form>
        </Box>
    </>
    )
}