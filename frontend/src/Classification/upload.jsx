import react from 'react'
import api from '../axios.js'
import { useState } from 'react'
import Projecttabs from '../project/Projecttabs.jsx';
export default function Upload(){
    const [requirementlist,setrequirementlist]=useState([]);
    const [clearlist,setclearlist]=useState([]);
    const [duplicatelist,setduplicatelist]=useState([]);
    const [incompletelist,setincompletelist]=useState([]);
    const [conflictedlist,setconflictedlist]=useState([]);
    const [File,setFile]=useState(null);
    const dividerequirementlist=(reql)=>{
        reql.map((rl)=>{
            if(rl.status==='clear'){
                setclearlist(prev=>[...prev,rl]);
            }
            else if(rl.status==='incomplete'){
                setincompletelist(prev=>[...prev,rl]);
            }
            else if(rl.status==='duplicate'){
                setduplicatelist(prev=>[...prev,rl]);
            }   
            else if(rl.status==='conflicted'){
                setconflictedlist(prev=>[...prev,rl]);
            }
        })
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const formData=new FormData(e.target);
        try{
            const res=await api.post('upload',formData,{
                headers:{
                    'Content-Type':'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res=>{
                console.log("Requirements:", res.data.requirements);
                setrequirementlist(res.data.requirements);
                dividerequirementlist(res.data.requirements);
            })
            .catch(err=>{
                console.log(err);
            })
            
        }
        catch(err){
            console.log(err)
        }
    }
    
    return(
    <>
    <form method="post" action="/upload" onSubmit={handleSubmit} style={{display:'flex',justifyContent:'space-evenly', margin:'1rem'}}>
         <input type="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
       {File && <p style={{color:'black'}}>Selected file: {File.name}</p>}
        <button type="submit">Upload</button>
    </form>
    {/* <div>
        
            {requirementlist && requirementlist.map((m,idx)=>(
                
              <div key={idx} style={{display:'flex' , flexDirection:'column', margin:'1rem'}}>
              <p style={{color:'black'}}>Requirement: {m.requirement}</p>
              <p style={{color:'black'}}>Type: {m.type}</p>
              <p style={{color:'black'}}>Priority: {m.priority}</p>
            </div>
            ))}
    </div> */}
    <Projecttabs clearlist={clearlist} incompletelist={incompletelist} duplicatelist={duplicatelist} conflictedlist={conflictedlist}/>
    </>
    )
}