import React from "react";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import api from '../../axios'
import Navbar from '../../navbar.jsx'
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from "react-router-dom";
// import {usequeryparams} from 'react-router-dom'
import { useParams } from "react-router-dom";
//pid=projectid


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#fff",
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
};
export default function Sprint() {
    const { sid, projectid } = useParams();
    const [sprint, setsprint] = useState({});
    const [requirementlist, setrequirementlist] = useState([]);
    const [Teammembers, setTeammembers] = useState([]);
    const [allusers,setallusers]=useState([]);
    const [Assignedto, setAssignedto] = useState([]);
    //modal
    const [editingSprint, setEditingSprint] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [addedrequirementlist, setaddedrequirementlist] = useState([]);
    const navigate = useNavigate();
    const [Username, setUsername] = useState('');
    const [Userid, setUserid] = useState('');
    const [Userrole, setUserrole] = useState('');
    const [Companyid, setCompanyid] = useState('');
    useEffect(()=>{
        api.get("profile")
        .then(res => {
            console.log(res.data)
            setUsername(res.data.name)
            setUserid(res.data.id)
            setUserrole(res.data.role)
            setCompanyid(res.data.company_id)
        })
        .catch(err => console.log(err))
    },[])
    useEffect(() => {
        async function fetchsprint() {
            try {
                const response = await api.get(`${sid}/getsprint`);
                console.log("Sprint details fetched successfully:", response.data);
                setsprint(response.data);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchsprint()
    }, [])
    useEffect(() => {
        async function fetchreqs() {
            try {
                const res = await api.get(`getrequirements/${projectid}`)
                const reqs = res.data
                    .map((r, i) => ({
                        id: i,
                        ...r,
                        added: false,
                    }))
                    .filter((r) => r.sprint_id === null)
                // reqs=reqs.filter((r)=>r.sprint_id===parseInt(sid))
                setrequirementlist(reqs)
                const addedreqs = res.data
                    .map((r, i) => ({
                        id: i,
                        ...r,
                        added: true,
                    }))
                    .filter((r) => r.sprint_id === parseInt(sid))
                setaddedrequirementlist(addedreqs)
            }
            catch (err) {
                console.error("Failed to load", err);
            }
        }
        fetchreqs()
    }, [])
    const formatDateTimeLocal = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
};
    const handleAdd = async (rid, sid) => {
        try {
            const response = await api.post(`${sid}/addrequirement`, { requirement_id: rid })
            console.log("Requirement added successfully:", response.data);
            alert("Requirement added successfully!");
            setrequirementlist((prevList) =>
                prevList.map((req) =>
                    req.id === rid ? { ...req, added: true } : req
                )
            );
            setaddedrequirementlist((prevList) => [
                ...prevList,
                requirementlist.find((req) => req.id === rid),
            ]);
        } catch (error) {
            console.error('Error adding requirement:', error);
        }
    }
    const handleEditSprint = async (sid) =>{
            await api.post(`${sid}/editsprint`,{editingSprint})
            .then(res =>{
                alert("Sprint updated successfully")
                window.location.reload();
            })
            .catch(err =>{
                console.log(err)
                // alert("Error updating sprint")
            })
        }
    // useEffect(()=>{
    //     async function fetch(){
    //         await api.get(`${Companyid}/alluser`)
    //         .then(res=>{
    //             console.log(res.data)

    //             const tm=res.data.filter((user) => user.role === 'DEVELOPER' )
    //             console.log(tm)
    //             setallusers(tm)
    //         })
    //         .catch(err =>{
    //             console.log(err)
    //             alert("Error fetching users")
    //     })
    //     }fetch();

    // },[])
    useEffect(() => {
    if (!Companyid) return;

    async function fetchUsers() {
        try {
            const res = await api.get(`${Companyid}/alluser`);

            const tm = res.data.filter(
                (user) => user.role === 'DEVELOPER'
            );

            console.log("Developers:", tm);
            setallusers(tm);
        } catch (err) {
            console.log(err);
            alert("Error fetching users");
        }
    }

    fetchUsers();
}, [Companyid]);
    const handleAddteamembers = async (assignedlist) =>{
        await api.post(`${projectid}/addprojectmember`,{users: assignedlist})
        .then(res =>{
            console.log(res.data)
            // setTeammembers(res.data)
            window.location.reload();
        })
        .catch(err =>{
            console.log(err)
            alert("Error fetching users")
        })
    }
    //allprojectmember
    useEffect(()=>{
        async function fetch(){
            await api.get(`${projectid}/allprojectmember`)
            .then(res=>{
                console.log(`sprint members ${res.data}`)
                console.log(typeof(res.data))
                setTeammembers(res.data)
            })
            .catch(err =>{
                console.log(err)
                alert("Error fetching users")
        })
        }fetch();

    },[])
    return (
        <>
            <Navbar />
            <Box sx={{ width: '100%' }}>
                {sprint && (
                    <>
                        <h2 style={{ color: 'black' }}>Sprint Details</h2>
                        <p style={{ color: 'black' }}><strong>Name:</strong> {sprint.name}</p>
                        <p style={{ color: 'black' }}><strong>Goal:</strong> {sprint.goal}</p>
                        <p style={{ color: 'black' }}><strong>Start Date:</strong> {new Date(sprint.start_date).toLocaleString()}</p>
                        <p style={{ color: 'black' }}><strong>End Date:</strong> {new Date(sprint.end_date).toLocaleString()}</p>
                        <p style={{ color: 'black' }}><strong>Status:</strong> {sprint.status}</p>
                        <Button onClick={()=>{
                            setOpen(true)
                            setEditingSprint({...sprint})
                            }} >Edit Sprint</Button>
                    </>
                )}
                {Userrole === 'MANAGER' && (<>
                   
                    <Autocomplete
                    multiple
                    options={allusers}
                    getOptionLabel={(option) => option.name}
                    value={Assignedto}
                    onChange={(e, newValue) => {
                        setAssignedto(newValue); // newValue is an ARRAY
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Assigned To" />
                    )}
                />
                <Button onClick={() => handleAddteamembers(Assignedto)}>Add Team Members</Button>
                </>)}
                {Teammembers && (<>
                    <h4 style={{color:'black'}}>Team Members</h4>
                    <ul>
                    {Teammembers.map((m,i)=>(
                    <li key={i} style={{color:'black'}}>{m.name}</li>
                        ))}</ul>
                </>)}
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} columns={16}>
                        <Grid size={8}>
                            <Item>
                                <h2 style={{ color: 'black' }}>Requirements available </h2>
                                {requirementlist && requirementlist.map((m, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '1rem', borderRadius: '0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                                                <Chip label={m.type} color={"primary"} />
                                                <Chip label={m.priority} color={m.priority === "Critical" ? "error" : m.priority === "High" ? "warning" : m.priority === "Medium" ? "success" : "primary"} />
                                            </div>
                                            <p style={{ color: 'black' }}>Requirement: {m.requirement}</p>
                                            <Button onClick={() => handleAdd(m.id, sid)} variant="contained" color="primary" disabled={m.added}>Add</Button>
                                        </div>
                                    </div>
                                ))
                                }
                            </Item>
                        </Grid>
                        <Grid size={8}>
                            <Item>
                                <h2 style={{ color: 'black' }}>Requirements added to this sprint</h2>
                                {addedrequirementlist && addedrequirementlist.map((m, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '1rem', borderRadius: '0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                                                <Chip label={m.type} color={"primary"} />
                                                <Chip label="Added" color={"success"} variant="outlined" />
                                                <Chip label={m.priority} color={m.priority === "Critical" ? "error" : m.priority === "High" ? "warning" : m.priority === "Medium" ? "success" : "primary"} />
                                            </div>
                                            <p style={{ color: 'black' }}>Requirement: {m.requirement}</p>
                                            
                                        </div>
                                    </div>
                                ))
                                }
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
                {/* {requirementlist && requirementlist.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '1rem', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                                <Chip label={m.type} color={"primary"} />
                                <Chip label={m.priority} color={m.priority === "Critical" ? "error" : m.priority === "High" ? "warning" : m.priority === "Medium" ? "success" : "primary"} />
                            </div>
                            <p style={{ color: 'black' }}>Requirement: {m.requirement}</p>
                            <Button onClick={() => handleAdd(m.id, sid)} variant="contained" color="primary" disabled={m.added}>Add</Button>
                        </div>
                    </div>
                ))
                } */}
                {/* {addedrequirementlist && addedrequirementlist.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '1rem', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                                <Chip label={m.type} color={"primary"} />
                                <Chip label="Added" color={"success"} variant="outlined" />
                                <Chip label={m.priority} color={m.priority === "Critical" ? "error" : m.priority === "High" ? "warning" : m.priority === "Medium" ? "success" : "primary"} />
                            </div>
                            <p style={{ color: 'black' }}>Requirement: {m.requirement}</p>
                            
                        </div>
                    </div>
                ))
                } */}
                <Modal open={open} onClose={() => setOpen(false)}>
                    <Box sx={style}>
                        {editingSprint && (
                            <form >
                                <TextField
                                    label="Name"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    value={editingSprint.name}
                                    onChange={(e) =>
                                        setEditingSprint({
                                            ...editingSprint,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <TextField
                                    label="Goal"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    value={editingSprint.goal}
                                    onChange={(e) =>
                                        setEditingSprint({
                                            ...editingSprint,
                                            goal: e.target.value,
                                        })
                                    }
                                />
                                <input type="datetime-local" defaultValue={formatDateTimeLocal(editingSprint.start_date)} onChange={(e) =>
                                    setEditingSprint({
                                        ...editingSprint,
                                        start_date: e.target.value,
                                    })
                                }></input>
                                <input type="datetime-local" defaultValue={formatDateTimeLocal(editingSprint.end_date)} onChange={(e) =>
                                    setEditingSprint({
                                        ...editingSprint,
                                        end_date: e.target.value,
                                    })
                                }></input>
                                <Button variant="contained" onClick={() => handleEditSprint(editingSprint.id)}>
                                    Update
                                </Button>
                            </form>
                        )}
                    </Box>
                </Modal>
            </Box>

        </>
    )
}