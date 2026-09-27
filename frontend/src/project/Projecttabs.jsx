import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Button } from '@mui/material';
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
  High:     { bgcolor: '#ffe5c4', color: '#C2410C' },
  Medium:   { bgcolor: '#FEF3C7', color: '#92400E' },
  Low:      { bgcolor: '#E0F2FE', color: '#0369A1' },
};

const requirementStyles = {
  "Functional":     { bgcolor: '#E0F2FE', color: '#0369A1' },
  "Non-Functional": { bgcolor: '#F3F4F6', color: '#4B5563' },
  "Security":       { bgcolor: '#FEE2E2', color: '#991B1B' },
  "Performance":    { bgcolor: '#FEF3C7', color: '#D97706' },
  "UI/UX":          { bgcolor: '#F3E8FF', color: '#7E22CE' },
};

export default function Projecttabs({ clearlist, incompletelist, duplicatelist, conflictedlist }) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Clear" {...a11yProps(0)} />
          <Tab label="Incomplete" {...a11yProps(1)} />
          <Tab label="Duplicate" {...a11yProps(2)} />
          <Tab label="Conflict" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {clearlist && clearlist.map((m,idx)=>(
            <div key={idx} style={{display:'flex' , flexDirection:'column', margin:'1rem'}}>
                <div style={{display:'flex', flexDirection:'column', border:'1px solid black', padding:'1rem', borderRadius:'0.5rem'}}>
                    <div style={{display:'flex', gap:'1rem', marginBottom:'0.5rem',alignItems:'flex-start',justifyContent:'flex-end'}}>
                        <Chip label={m.type} color={"primary"} sx={requirementStyles[m.type]}/>
                        <Chip label={m.priority} 
                        color={m.priority==="Critical" ? "error" : m.priority==="High" ? "warning" :m.priority==="Medium" ? "success" : "primary"} 
                        sx={priorityStyles[m.priority] }
                        />
                    </div>
                    <p style={{color:'black'}}>Requirement: {m.requirement}</p>
                    <div>
                      <Button variant="outlined" >Edit</Button>
                      <Button variant="contained" color='error'>Delete</Button>
                      <Button variant="contained" color="secondary">Save</Button>
                    </div>
                </div>
            </div>
        ))
        }

      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {incompletelist && incompletelist.map((m,idx)=>(
            <div key={idx} style={{display:'flex' , flexDirection:'column', margin:'1rem'}}>
                <div style={{display:'flex', flexDirection:'column', border:'1px solid black', padding:'1rem', borderRadius:'0.5rem'}}>
                    <div style={{display:'flex', gap:'1rem', marginBottom:'0.5rem',alignItems:'flex-start',justifyContent:'flex-end'}}>
                        <Chip label={m.type} color={"primary"} />
                        <Chip label={m.priority} 
                        // color={m.priority==="Critical" ? "error" : m.priority==="High" ? "warning" :m.priority==="Medium" ? "success" : "primary"} 
                        sx={priorityStyles[m.priority] }
                        />
                    </div>
                    <p style={{color:'black'}}>Requirement: {m.requirement}</p>
                    <div>
                      <Button variant="outlined" >Edit</Button>
                      <Button variant="contained" color='error'>Delete</Button>
                      <Button variant="contained" color="secondary">Save</Button>
                    </div>
                </div>
              
            </div>
        ))
        }
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {duplicatelist && duplicatelist.map((m,idx)=>(
            <div key={idx} style={{display:'flex' , flexDirection:'column', margin:'1rem'}}>
                <div style={{display:'flex', flexDirection:'column', border:'1px solid black', padding:'1rem', borderRadius:'0.5rem'}}>
                    <div style={{display:'flex', gap:'1rem', marginBottom:'0.5rem',alignItems:'flex-start',justifyContent:'flex-end'}}>
                        <Chip label={m.type} color={"primary"} />
                        <Chip label={m.priority} color={m.priority==="Critical" ? "error" : m.priority==="High" ? "warning" :m.priority==="Medium" ? "success" : "primary"} />
                    </div>
                    <p style={{color:'black'}}>Requirement: {m.requirement}</p>
                    <div>
                      <Button variant="outlined" >Edit</Button>
                      <Button variant="contained" color='error'>Delete</Button>
                      <Button variant="contained" color="secondary">Save</Button>
                    </div>
                </div>
              <Button variant="contained">Delete all</Button>
            </div>
        ))
        }
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {conflictedlist && conflictedlist.map((m,idx)=>(
            <div key={idx} style={{display:'flex' , flexDirection:'column', margin:'1rem'}}>
                <div style={{display:'flex', flexDirection:'column', border:'1px solid black', padding:'1rem', borderRadius:'0.5rem'}}>
                    <div style={{display:'flex', gap:'1rem', marginBottom:'0.5rem',alignItems:'flex-start',justifyContent:'flex-end'}}>
                        <Chip label={m.type} color={"primary"} />
                        <Chip label={m.priority} color={m.priority==="Critical" ? "error" : m.priority==="High" ? "warning" :m.priority==="Medium" ? "success" : "primary"} />
                    </div>
                    <p style={{color:'black'}}>Requirement: {m.requirement}</p>
                    <p style={{color:'black'}}>{m.reason}</p>
                    <div style={{display:'flex',gap:'1rem',border:'solid black 2px'}}>
                      <Button variant="contained">Edit</Button>
                      <Button variant="outlined">Delete</Button></div>
                </div>
              
            </div>
        ))
        }
      </CustomTabPanel>
    </Box>
  );
}
