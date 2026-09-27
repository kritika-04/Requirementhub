import React from 'react'
import { useState } from 'react'
import {useParams} from 'react-router-dom'
// import {usequeryparams} from 'react-router-dom'
import { useEffect } from 'react'
import api from '../axios.js'
import Merge from '../Classification/Merge1.jsx'
import Navbar from '../navbar.jsx'
import Chip from '@mui/material/Chip';
import Requirement from './Requirement/Requirement.jsx'

export default function Project(){
    const Requiremnts=[
    {requirement: 'Implement customer registration functionality supporting email and Google login.', type: 'Functional', priority: 'High'},
    {requirement: 'Enforce mandatory email verification for new accounts before granting access to the platform.', type: 'Security', priority: 'High'},
    {requirement: 'Enable customers to browse products on the website.', type: 'Functional', priority: 'High'},
    {requirement: 'Implement product search functionality to allow customers to find items efficiently.', type: 'Functional', priority: 'High'},
    {requirement: 'Provide a shopping cart feature for customers to add and manage products before checkout.', type: 'Functional', priority: 'High'}
    ]
    const [requirementlist,setrequirementlist]=useState([]);
    // setrequirementlist(Requiremnts);
    const projectid=useParams().projectid;
    console.log("Project ID from URL:", projectid);
    const [projectname,setprojectname]=useState('');
    const [projectdescription,setprojectdescription]=useState('');
    // const [projectstatus,setprojectstatus]=useState('');
    useEffect(()=>{
        async function fetchprojectdetails(){
            await api.get(`projectdetails/${projectid}`)
            .then(res=>{
                console.log(`Project details: ${JSON.stringify(res.data)}`);
                setprojectname(res.data.name);
                setprojectdescription(res.data.description);
            })
            .catch(err=>{
                console.log(err);
            } )
        }
        fetchprojectdetails();
    },[])
    return (
        <>
        <Navbar/>
        <h1>Project ID: {projectid}</h1>
        <h2>Project Name: {projectname}</h2>
        <p>Project Description: {projectdescription}</p>
        {/* <Classification />
        {requirementlist && requirementlist.map((m,idx)=>(
            <div key={idx} style={{display:'flex' , flexDirection:'column', margin:'1rem'}}>
                <div style={{display:'flex', flexDirection:'column', border:'1px solid black', padding:'1rem', borderRadius:'0.5rem'}}>
                    <div style={{display:'flex', gap:'1rem', marginBottom:'0.5rem',alignItems:'flex-start',justifyContent:'flex-end'}}>
                        <Chip label={m.type} color={"primary"} />
                        <Chip label={m.priority} color={m.priority==="Critical" ? "error" : m.priority==="High" ? "warning" :m.priority==="Medium" ? "success" : "primary"} />
                    </div>
                    <p style={{color:'black'}}>Requirement: {m.requirement}</p>
                </div>
              
            </div>
        ))
        } */}
        <Merge projectid={projectid}/>
        {/* <Requirements projectid={projectid}/> */}
        <a href={`/${projectid}/requirement`} >Requirementlist</a>
        </>
    )
}






