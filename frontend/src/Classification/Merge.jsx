import react, { useEffect, useState } from 'react'
import api from '../axios.js'
import Upload from './upload.jsx';
import Projecttabs from '../project/Projecttabs.jsx';
import { Button } from '@mui/material';

// const req=[{'requirement': 'The system shall support secure multi-factor authentication (MFA) for verified users to ensure authorized access.', 'type': 'Security', 'priority': 'Critical', 'status': 'clear'}, {'requirement': 'The system shall allow verified users to log in securely using multi-factor authentication (MFA).', 'type': 'Functional', 'priority': 'High', 'status': 'clear'}, {'requirement': 'The system shall enable users to upload CSV data files via the main dashboard, with a maximum file size limit of 50 megabytes.', 'type': 'Functional', 'priority': 'Medium', 'status': 'clear'}, {'requirement': 'The system shall validate and process uploaded CSV files without exceeding the 50MB size limit, rejecting files that violate this constraint.', 'type': 'Performance', 'priority': 'Medium', 'status': 'clear'}, {'requirement': 'The system shall provide a user-friendly interface in the main dashboard for uploading CSV files, including clear instructions and feedback on upload status.', 'type': 'UI/UX', 'priority': 'Medium', 'status': 'clear'}, {'requirement': 'The system shall extract individual software requirements from the uploaded CSV data files.', 'type': 'Functional', 'priority': 'High', 'status': 'clear'}, {'requirement': 'The system shall ensure that the extraction of software requirements from CSV files is accurate and error-free, handling malformed data gracefully.', 'type': 'Non-Functional', 'priority': 'Medium', 'status': 'clear'}, {'requirement': 'The system shall maintain the integrity and confidentiality of uploaded CSV files during processing and storage, adhering to security best practices.', 'type': 'Security', 'priority': 'High', 'status': 'clear'}, {'requirement': 'The system shall provide real-time feedback to users regarding the progress and success/failure of CSV file uploads and requirement extraction.', 'type': 'UI/UX', 'priority': 'Medium', 'status': 'clear'}]

export default function Merge() {
    // const [requirementlist, setrequirementlist] = useState(req);
    const [pastedText, setPastedText] = useState('')
    const [jsonMessage, setjsonMessage] = useState([]);
    const [requirementlist, setrequirementlist] = useState();
    const [clearlist, setclearlist] = useState([])
    const [incompletelist, setincompletelist] = useState([])
    const [duplicatelist, setduplicatelist] = useState([])
    const [conflictedlist, setconflictedlist] = useState([])
    const [files, setFiles] = useState([]);
    const dividerequirementlist = (reql) => {
    const clear = [];
    const incomplete = [];
    const duplicate = [];
    const conflict = [];

    reql.forEach((rl) => {
        if (rl.status === "clear") clear.push(rl);
        else if (rl.status === "incomplete") incomplete.push(rl);
        else if (rl.status === "duplicate") duplicate.push(rl);
        else if (rl.status === "conflict") conflict.push(rl);
    });

    setclearlist(clear);
    setincompletelist(incomplete);
    setduplicatelist(duplicate);
    setconflictedlist(conflict);
};
    // dividerequirementlist(requirementlist)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        if (pastedText.trim() === '' && files.length === 0) {
            alert("Please provide either pasted text or upload a file.");
            return;
        }
        if (pastedText) {
            formData.append("pastedText", pastedText);
        }
        if (files) {
            files.forEach((file) => {
                formData.append("files", file);
            });
        }
        await api.post('requirement_submit', formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
            .then(res => {
                console.log(res.data)
                const reqs = res.data.requirements;
                setjsonMessage(reqs)
                setrequirementlist(reqs)
                console.log("Requirementlist",requirementlist)
                dividerequirementlist(reqs)
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (<>
        <form method="POST" onSubmit={handleSubmit}
            //     style={{ display: 'flex', flexDirection: 'column', margin: '1rem' ,gap:'1rem' ,border:"black 2px solid",borderRadius: '4px',
            // backgroundColor: '#fff'}}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                padding: "24px",
                background: "#fff",
                border: "1px solid #d9d9d9",
                borderRadius: "10px",
                maxWidth: "900px",
                margin: "20px auto",
            }}
        >
            {/* <div className="paste-zone" style={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                <textarea
                    style={{ margin: '1rem' }}
                    rows={4}
                    placeholder="Paste raw transcript text, Slack messages, or client emails..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                />
            </div> */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontWeight: "600", color: "#333" }}>
                    Requirement Source
                </label>

                <textarea
                    rows={6}
                    placeholder="Paste meeting transcript, client email, Slack messages, or project notes..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    style={{
                        padding: "12px",
                        border: "1px solid #cfcfcf",
                        borderRadius: "8px",
                        fontSize: "14px",
                        resize: "vertical",
                        outline: "none",
                    }}
                />
            </div>
            <div
                // style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 'auto' }}
                style={{
                    border: "1px dashed #bdbdbd",
                    borderRadius: "8px",
                    padding: "18px",
                    textAlign: "center",
                    background: "#fafafa",
                }}
            >
                <input
                    type="file"
                    name="files"
                    multiple

                    onChange={(e) => {
                        const selected = Array.from(e.target.files);

                        setFiles(prev => [...prev, ...selected]);
                    }}
                />
                <p style={{ marginTop: "10px", color: "#666", fontSize: "13px" }}>
                    Upload PDF, DOCX or TXT files
                </p>

                {files.length > 0 && (
                    <div
                        style={{
                            marginTop: "12px",
                            textAlign: "left",
                            background: "#fff",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #eee",
                        }}
                    >
                        <p
                            style={{
                                margin: "0 0 8px",
                                fontWeight: "600",
                                color: "#333",
                            }}
                        >Selected files:</p>
                        {files.map((file, index) => (
                            <p key={index} style={{
                                padding: "6px 0",
                                borderBottom:
                                    index !== files.length - 1 ? "1px solid #f1f1f1" : "none",
                                color: "#444",
                                fontSize: "14px",
                            }}>{file.name}</p>
                        ))}
                    </div>
                )}</div>
            <Button
                className="btn-submit-text"
                type='submit'
                variant="contained"
                // style={{
                //     backgroundColor: '#1976d2', // Solid Material UI Blue matching your image
                //     color: '#fff',
                //     padding: '0.75rem',
                //     borderRadius: '0px 0px 3px 3px', // Rounds only the bottom edges to match the parent container
                //     textTransform: 'uppercase',
                //     fontWeight: '600',
                //     boxShadow: 'none'
                // }}
                style={{
                    background: "#1976d2",
                    color: "#fff",
                    padding: "12px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "15px",
                }}
            >
                <span>Analyze with AI</span>
            </Button>
        </form>
        < Projecttabs clearlist={clearlist} incompletelist={incompletelist} duplicatelist={duplicatelist} conflictedlist={conflictedlist} />
        {/* <div>
        
            {requirementlist && requirementlist.map((m,idx)=>(
                
              <div key={idx} style={{display:'flex' , flexDirection:'column', margin:'1rem'}}>
              <p style={{color:'black'}}>Requirement: {m.requirement}</p>
              <p style={{color:'black'}}>Type: {m.type}</p>
              <p style={{color:'black'}}>Priority: {m.priority}</p>
            </div>
            ))}
    </div> */}
    </>)
}