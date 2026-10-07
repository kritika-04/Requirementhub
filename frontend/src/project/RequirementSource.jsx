import React from "react";
import Navbar from '../navbar.jsx'
import Merge from "../Classification/Merge1";
import { useParams } from "react-router-dom";
export default function RequirementSource(){
    const {projectid}=useParams()
    return(<>
    <Navbar/>
    <Merge projectid={projectid}/>
    </>)
}