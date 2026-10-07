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
import ProjectPlanning from './ProjectPlanning.jsx'
export default function Project(){
    const Requiremnts=[
    {requirement: 'Implement customer registration functionality supporting email and Google login.', type: 'Functional', priority: 'High'},
    {requirement: 'Enforce mandatory email verification for new accounts before granting access to the platform.', type: 'Security', priority: 'High'},
    {requirement: 'Enable customers to browse products on the website.', type: 'Functional', priority: 'High'},
    {requirement: 'Implement product search functionality to allow customers to find items efficiently.', type: 'Functional', priority: 'High'},
    {requirement: 'Provide a shopping cart feature for customers to add and manage products before checkout.', type: 'Functional', priority: 'High'}
    ]
    
    const [Username, setUsername] = useState('');
    const [Userid, setUserid] = useState('');
    const [Userrole, setUserrole] = useState('');
    const [requirementlist,setrequirementlist]=useState([]);
    // setrequirementlist(Requiremnts);
    const projectid=useParams().projectid;
    const [projectplanning,setprojectplanning]=useState({projectid:projectid,id:'',planned_end_date:'',planned_number_of_sprints:'',planned_number_of_team_members:'',planned:false});
    console.log("Project ID from URL:", projectid);
    const [projectname,setprojectname]=useState('');
    const [projectdescription,setprojectdescription]=useState('');
    const [allsprintlist,setallsprintlist]=useState([]);
    // const [projectstatus,setprojectstatus]=useState('');
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
    useEffect(()=>{
        async function fetchprojectplanning(){
            await api.get(`${projectid}/getprojectplanning`)
            .then(res=>{
                console.log(`Project planning: ${res.data}`);
                setprojectplanning({projectid:projectid, ...res.data,planned:true});
                console.log(`Project planning: ${projectplanning}`);
            })
            .catch(err=>{
                console.log(err);
            } )
        }
        fetchprojectplanning();
    },[])
    useEffect(()=>{
        async function fetchsprintall(){
            await api.get(`${projectid}/getallsprint`)
            .then(res=>{
                setallsprintlist(res.data);
                console.log(`All sprint list: ${JSON.stringify(res.data)}`);
            })
            .catch(err=>{
                console.log(err);
            })
        }
        fetchsprintall();
    },[])
    // const handleEditSprint = async (sid) =>{
    //     await api.post(`${sid}/editsprint`,{})
    // }
    // <Button onClick={handleOpen} >Edit Sprint</Button>
    // const handleclick=async ()=>{
    //     await api.post(`${projectplanning.id}/editprojectplanning`,{})
    //     .then(res=>{
    //         console.log(`Project planning edited: ${res.data}`);
    //         setprojectplanning({projectid:projectid, ...res.data,planned:true});
    //         alert('Project planning edited')
    //         window.location.reload();
    //     })
    // }
    return (
        <>
        <Navbar/>
        <h1>Project ID: {projectid}</h1>
        <h2>Project Name: {projectname}</h2>
        <p>Project Description: {projectdescription}</p>
        <a href={`/${projectid}/AddSprint`} >Add Sprint</a>
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
        {(Userrole === 'MANAGER' || Userrole === 'OWNER') && projectplanning.planned === false && <ProjectPlanning pid={projectid} userid={Userid}/>}
        {projectplanning.planned === true && (<>
        <p>{projectplanning.planned}</p>
            <p style={{color:'black'}}>Planned End Date: {new Date(projectplanning.planned_end_date).toLocaleString()}</p>
            <p style={{color:'black'}}>Planned Number of Sprints: {projectplanning.planned_number_of_sprints}</p>
            <p style={{color:'black'}}>Planned Number of Team Members: {projectplanning.planned_number_of_team_members}</p>
            {/* <button color="error" variant="outlined" onClick={handleclick}>Edit</button> */}
        </>)}
        {allsprintlist.length > 0 && (<>
            <h3>All Sprints</h3>
            {allsprintlist.map((sprint) => (
                <div key={sprint.id} style={{ border: '1px solid black', padding: '1rem', margin: '1rem' }}>
                    <h4 style={{color:'black'}}>{sprint.name}</h4>
                    <p style={{color:'black'}}>{sprint.goal}</p>
                    <p style={{color:'black'}}>Planned Start Date: {new Date(sprint.start_date).toLocaleString('en-In',{dateStyle:'medium', timeStyle:'short'})}</p>
                    <p style={{color:'black'}}>Planned End Date: {new Date(sprint.end_date).toLocaleString('en-In',{dateStyle:'medium', timeStyle:'short'})}</p>
                    
                    <a href={`/${projectid}/${sprint.id}/Sprint`}>View Sprint</a>
                </div>   
            ))}
        </>)}
        {/* <Merge projectid={projectid}/> */}
        <a href={`/${projectid}/requirementsource`} >Requirement Source</a>
        {/* <Requirements projectid={projectid}/> */}
        <a href={`/${projectid}/requirement`} >Requirementlist</a>
        </>
    )
}
