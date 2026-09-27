import * as React from 'react';
import { useState , useEffect} from 'react';
import Navbar from '../../navbar.jsx';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Button, Modal, TextField } from '@mui/material';
// import api from '../../axios.js'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import api from '../../axios.js'
import { green } from '@mui/material/colors';
import axios from 'axios';
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            tabIndex={0}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
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

export default function Projecttabs({ requirementlist,
    setRequirementlist , projectid }) {
    const [value, setValue] = React.useState(0);
    const [Username,setUsername]=useState('')
    const [Userid,setUserid]=useState('')
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [editingReq, setEditingReq] = useState(null);
    // dividerequirementlist(requirementlist)
    useEffect(()=>{
        api.get("profile")
        .then(res => {
            console.log(res.data)
            setUsername(res.data.name)
            setUserid(res.data.id)
            
        })
        .catch(err => console.log(err))
    },[])
    const updateRequirement = async () => {
        const updated = requirementlist.map((r) =>
            r.id === editingReq.id ? editingReq : r
        );
        await api.post('editrequirement',{editingReq,Userid})
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.error(err)
        })
        setRequirementlist(updated);
        setOpen(false);
    };
    
    return (<>
    <Navbar/>
        <Box sx={{ width: '100%' }}>
                {requirementlist && requirementlist.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', margin: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '1rem', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                                <Chip label={m.type} color={"primary"} sx={requirementStyles[m.type]} />
                                <Chip label={m.priority}
                                    color={m.priority === "Critical" ? "error" : m.priority === "High" ? "warning" : m.priority === "Medium" ? "success" : "primary"}
                                    sx={priorityStyles[m.priority]}
                                />
                                <Chip label={m.status} color={"primary"} sx={statusStyles[m.status]} />
                                {m.saved && <Chip label="saved" sx={{ color: 'green', bgcolor: '#ADEBB3' }} />}
                            </div>
                            <p style={{ color: 'black' }}>Requirement: {m.requirement}</p>
                            <div>
                                <Button variant="outlined" disabled={m.saved} onClick={() => {
                                    setEditingReq({ ...m });   // copy the clicked requirement
                                    setOpen(true);
                                }}>Edit
                                </Button>

                                <Button variant="contained" color='error' disabled={m.saved}>Delete</Button>
                                <a href={`/${m.id}/versionhistory`} >versionhistory</a>
                                {/* <Button variant="contained" color="secondary" disabled={m.saved} onClick={() => { save(m) }}>{m.saved ? "Saved" : "Save"}</Button> */}
                            </div>
                        </div>
                    </div>
                ))
                }
        </Box>
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={style}>
                {editingReq && (
                    <form >
                        {/* <TextField id='requirement' name='requirement' value={editingReq.requirement} 
                        // fullWidth={value.toString()}
                        // rows={5}
                            onChange={(e) =>
                                setEditingReq({
                                    ...editingReq,
                                    requirement: e.target.value,
                                })
                            }
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                boxSizing: "border-box",
                                marginBottom: "16px",
                                // height:"5px"
                            }}
                        ></TextField> */}
                        <TextField
                            label="Requirement"
                            multiline
                            rows={4}
                            fullWidth
                            value={editingReq.requirement}
                            onChange={(e) =>
                                setEditingReq({
                                    ...editingReq,
                                    requirement: e.target.value,
                                })
                            }
                        />
                        <FormControl fullWidth>
                            <InputLabel variant="standard"
                            >
                                Priority
                            </InputLabel>
                            <NativeSelect
                                value={editingReq.priority}
                                inputProps={{
                                    name: 'priority',
                                    // id: `${idx}-select`,
                                }}
                                onChange={(e) =>
                                    setEditingReq({
                                        ...editingReq,
                                        priority: e.target.value,
                                    })
                                }
                            >
                                <option value='Critical'>Critical</option>
                                <option value='High'>High</option>
                                <option value='Medium'>Medium</option>
                                <option value='Low'>Low</option>
                            </NativeSelect>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel variant="standard"
                            >
                                Type
                            </InputLabel>
                            <NativeSelect
                                value={editingReq.priority}
                                inputProps={{
                                    name: 'type',
                                    // id: `${idx}-select`,
                                }}
                                onChange={(e) =>
                                    setEditingReq({
                                        ...editingReq,
                                        priority: e.target.value,
                                    })
                                }
                            >
                                <option value='Security'>Security</option>
                                <option value='Functional'>Functional</option>
                                <option value='UI/UX'>UI/UX</option>
                                <option value='Performance'>Performance</option>
                                <option value='Non-Functional'>Non-Functional</option>
                            </NativeSelect>
                        </FormControl>
                        <Button variant="contained" onClick={updateRequirement}>
                            Update
                        </Button>
                    </form>
                )}
            </Box>
        </Modal>
    </>
    );
}
