
import react, { useEffect, useState } from 'react'
import api from '../axios.js'
import Upload from './upload.jsx';
export default function Classification(){
    const [pastedText,setPastedText]=useState('')
    const [jsonMessage,setjsonMessage]=useState([]);
    const handleSubmit=async (e)=>{
        e.preventDefault()
        await api.post('askai',{pastedText})
        .then(res=>{
            console.log(res.data)
            setjsonMessage(res.data.requirements)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return(<>
    <form method="post" onSubmit={handleSubmit}>
    <div className="paste-zone" style={{display:'flex' , flexDirection:'column' , margin:'1rem'}}>
            <textarea
            style={{margin:'1rem'}}
              rows={4}
              placeholder="Paste raw transcript text, Slack messages, or client emails..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            />
            <button 
              className="btn-submit-text"
              type='submit'
            >
              <span>Analyze with AI</span>
            </button>
          </div>
          </form>
          {/* <Upload/> */}
          <div>
            {jsonMessage.length>0 && jsonMessage.map((m,idx)=>(
              <div key={idx} style={{display:'flex' , flexDirection:'column', margin:'1rem'}}>
              <p style={{color:'black'}}>Requirement: {m.requirement}</p>
              <p style={{color:'black'}}>Type: {m.type}</p>
              <p style={{color:'black'}}>Priority: {m.priority}</p>
            </div>
            ))}
          </div>
    </>)
}