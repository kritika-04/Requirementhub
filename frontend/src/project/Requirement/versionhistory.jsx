import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../axios.js";
import Navbar from "../../navbar.jsx";
import { Box, Chip } from "@mui/material";
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
export default function VersionHistory() {
    const [versionhistorylist, setversionhistorylist] = useState([]);
    const [Userall, setUserall] = useState([]);
    const [editUsername, seteditUsername] = useState('');
    const { reqid } = useParams();
    console.log(reqid)
    useEffect(() => {
        async function fetch() {
            await api.get(`${reqid}/versionhistory`)
                .then((res) => {
                    console.log(res.data)
                    setversionhistorylist(res.data)
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
    return (
        <>
            <Navbar />
            <Box sx={{ width: '100%' }}>
                {versionhistorylist && versionhistorylist.map((m, idx) => (
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
                            <h2>Version {m.version}</h2>
                            <p style={{ color: 'black' }}>Requirement: {m.requirementtext}</p>
                            <p style={{ color: "grey", textAlign: "left" }}>
                                Edited by: {fetcheditusername(m.editedby_id)}
                            </p>
                        </div>
                    </div>
                ))
                }
            </Box>

        </>
    )
}