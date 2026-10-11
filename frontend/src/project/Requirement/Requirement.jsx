import React, { useEffect, useState } from "react";
import api from "../../axios.js"
import {useParams} from 'react-router-dom'
// import Projecttabs from "../Requirement/tabs1.jsx";
import Navbar from "../../navbar.jsx";
// import Projecttabs from '../Projecttabs1.jsx';
import Projecttabs from "./tabs.jsx";
export default function Requirement(){
    const [requirementlist,setrequirementlist]=useState([]);
    const {projectid}=useParams();
    useEffect(()=>{
        async function fetchreqs() {
            try{
                const res=await api.get(`getrequirements/${projectid}`)
                setrequirementlist(res.data)
                console.log(res.data)
            }
            catch(err){
                console.error("Failed to load", err);
            }
        }
        fetchreqs()
    },[])
    return(
    <>
    {/* <Navbar/> */}
    <h3 style={{color:'black'}}>Here is the list of requirements</h3>
    <Projecttabs requirementlist={requirementlist} setRequirementlist={setrequirementlist} projectid={projectid} alreadysaved={true}/>
    </>
    )
}