import  React from 'react'
import api from '../axios.js'
import useState from 'react'
import { FormControl, FormLabel, TextField } from '@mui/material';
import Projectlist from './Projectlist.jsx';

export default function projectform({companyid,userid}){
    
    async function handlesubmit(e){
        e.preventDefault();
        const formdata=new FormData(e.currentTarget);
        formdata.append('companyid',companyid);
        formdata.append('userid',userid);
        await api.post('create_project',formdata)
        .then(res=>{
            console.log(res.data);
            alert("Project created successfully");
            window.location.reload();
        })
        .catch(err=>{
            console.log(err);
        })
    }
    
    return(
    <>
        <div>
            <form onSubmit={handlesubmit} method="post">
                <FormControl>
                        <FormLabel htmlFor="projectname" ></FormLabel>
                        <TextField
                            id="projectname"
                            name="projectname" // Important: matches data.get('name')
                            placeholder="projectname"
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    sx: {
                                        '& ::placeholder': {
                                            color: 'black',
                                            opacity: 1, // Prevents the browser from fading the text
                                        },
                                    },
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="description" ></FormLabel>
                        <TextField id="description"
                            name="description" // Important: matches data.get('name')
                            placeholder="description">
                        </TextField>
                    </FormControl>
                <button type="submit">Create Project</button>
            </form>
            {/* <Projectlist companyid={companyid}/> */}
        </div>
    </>
    )
}