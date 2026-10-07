import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../axios.js";
import Navbar from "../../navbar.jsx";
import { Box, Chip , Button } from "@mui/material";
const priorityStyles = {
    Critical: { bgcolor: '#f05d5d9a', color: '#991B1B' }, //#f05d5d FEE2E2
    High: { bgcolor: '#ffe5c4', color: '#C2410C' },
    Medium: { bgcolor: '#FEF3C7', color: '#92400E' },
    Low: { bgcolor: '#E0F2FE', color: '#0369A1' },
};

const requirementStyles = {
    "Functional": { bgcolor: '#E0F2FE', color: '#0369A1' },
    "Non-Functional": { bgcolor: '#F3F4F6', color: '#4B5563' },
    "Security": { bgcolor: '#FEE2E2', color: '#991B1B' },
    "Performance": { bgcolor: '#FEF3C7', color: '#D97706' },
    "UI/UX": { bgcolor: '#F3E8FF', color: '#7E22CE' },
};

const statusStyles = {
    "clear": { bgcolor: '#e0fef4', color: '#03a157' },
    "incomplete": { bgcolor: '#FEE2E2', color: '#bd2d2d' },
    "Conflict": { bgcolor: '#FEF3C7', color: '#D97706' },
};
export default function RequirementSuggestion() {
    const [requirementsuggestionlist, setrequirementsuggestionlist] = useState([]);
    const [Userall, setUserall] = useState([]);
    const [editUsername, seteditUsername] = useState('');
    const [Username, setUsername] = useState('');
    const [Userid, setUserid] = useState('');
    const [Userrole, setUserrole] = useState('');
    const { reqid } = useParams();
    console.log(reqid)
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
    useEffect(() => {
        async function fetch() {
            await api.get(`${reqid}/allrequirementsuggestion`)
                .then((res) => {
                    console.log("requirement suggestions:", res.data);
                    const reqs = res.data.map((r, i) => ({
                    id: i,
                    ...r,
                    statusupdated: false
                }));
                    setrequirementsuggestionlist(reqs)
                    // seteditUserid(res.data.editedby_id)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        fetch();
    }, [])
    useEffect(() => {
        async function fetch() {
            await api.get('alluser')
                .then((res) => {
                    console.log(res.data)
                    setUserall(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        fetch();
    }, [])
    function fetcheditusername(id) {
        const user = Userall.find((e) => e.id === id);
        // print(user.name)
        return user ? user.name : "Unknown User";
    }
    
    async function handleclick(sid,rid,Userid,status) {
        await api.post(`${sid}/statusrequirementsuggest`,{rid,Userid,status})
        .then((res)=>{
            alert("updated successfully")
            console.log(res.data)
            const updated = requirementsuggestionlist.map(r =>
                r.id === id ? { ...r, statusupdated: true } : r
            );
            setrequirementsuggestionlist(updated);
        })
        .catch(()=>{
            alert("error in updating status")
        })
    }
    return (
        <>
            <Navbar />
            <Box sx={{ width: '100%' }}>
                {requirementsuggestionlist && requirementsuggestionlist.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '1rem', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'flex-start', justifyContent: 'flex-end' }}>

                                <Chip label={m.suggestedtype} color={"primary"} sx={requirementStyles[m.type]} />
                                <Chip label={m.suggestedpriority}
                                    color={m.priority === "Critical" ? "error" : m.priority === "High" ? "warning" : m.priority === "Medium" ? "success" : "primary"}
                                    sx={priorityStyles[m.suggestedpriority]}
                                />
                                <Chip label={m.status} color={"primary"} sx={statusStyles[m.status]} />
                                {m.statusupdated && m.status=='approved' && <Chip label="saved" sx={{ color: 'green', bgcolor: '#ADEBB3' }} />}
                                {m.statusupdated && m.status=='declined' && <Chip label="saved" sx={{ color: 'red', bgcolor: '#ee6f8f' }} />}
                            </div>
                            <p style={{ color: 'black' }}>Requirement: {m.suggestedrequirement}</p>
                            {Userrole=='MANAGER' && (
                                <div>
                                <Button color="success" variant="outlined" onClick={()=>handleclick(m.id,m.requirement_id,Userid,'approved')} disabled={m.status!='pending'}>Approve</Button>
                                <Button color="error" variant="outlined" onClick={()=>handleclick(m.id,m.requirement_id,Userid,'rejected')} disabled={m.status!='pending'} style={{ marginLeft: '1rem' }}>
                                    Reject
                                </Button>
                            </div>
                            )}
                            <p style={{ color: "grey", textAlign: "left" }}>
                                Suggested by: {fetcheditusername(m.suggestedby_id)}
                            </p>
                            <p style={{ color: "grey", textAlign: "left" }}>
                                Suggested at: {new Date(m.suggestedat).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' ,dateStyle: 'medium', timeStyle: 'short'})}
                            </p>
                        </div>
                    </div>
                ))
                }
            </Box>

        </>
    )
}