import react, { useState, useEffect } from 'react';
import api from '../axios.js';
import { FormControl, FormLabel, TextField } from '@mui/material';
export default function Projectlist({companyid}){
    const [projectlist,setprojectlist]=useState([]);
    useEffect(()=>{
            async function fetchprojectlist(){
                await api.get(`projectlist/${companyid}`)
                .then(res=>{
                    console.log(`Project list: ${JSON.stringify(res.data)}`);
                    console.log(typeof res.data);
                    setprojectlist(res.data);
                })
                .catch(err=>{
                    console.log(err);
                } )  
            }
            if (companyid) {
                fetchprojectlist();
            }
            
        },[companyid])
    return(<>
    {projectlist.length>0 && projectlist.map((p)=>(
        <div key={p.id} style={{display:'flex' , flexDirection:'column', margin:'1rem' , color:'black'}} >
             <h3>{p.id}. {p.name}</h3>
            <p>{p.description}</p>
            <a href={`/project/${p.id}`}>View Details</a>
        </div>
    ))}
    </>)
}