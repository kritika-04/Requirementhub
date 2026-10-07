import React from "react";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import NumberField from '@mui/material/TextField';
import api from '../axios.js'
// import {usequeryparams} from 'react-router-dom'
//pid=projectid
export default function ProjectPlanning({pid,userid}){
    const [noofsprint, setnoofsprint] = useState('');
    const [noofteammembers, setnoofteammembers] = useState('');
    
    const handleSubmit=async (event)=>{
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try{
            const response = await api.post(`${pid}/projectplanning`, {
                planned_end_date: data.get('planned-end-date'),
                planned_number_of_sprints: noofsprint,
                planned_number_of_team_members: noofteammembers,
                userid: userid
            });
            console.log("Planning response:", response.data);
            alert("Project planning saved successfully!");
            window.location.reload(); // Reload the page to reflect the changes
        }   
        catch(err){
            console.log(err)    
        }
    }
    return (
    <>
        <Box sx={{ width: '100%' }}>
            <form style={{display:'flex', flexDirection:'column', gap:'1rem', padding:'1rem', border:'1px solid black', borderRadius:'0.5rem'}} method="post" component="form" onSubmit={handleSubmit}>
                <input type="datetime-local" id="planned-end-date" name="planned-end-date" />
                <NumberField label="Number of Sprint" id="number-of-sprint" min={1} max={40} onChange={(e) => setnoofsprint(e.target.value)} />
                <NumberField label="Number of Team Members" id="number-of-team-members" min={1} max={40} onChange={(e) => setnoofteammembers(e.target.value)} />
                <button type="submit" variant="contained" color="primary">Submit</button>
            </form>
        </Box>
    </>
    )
}