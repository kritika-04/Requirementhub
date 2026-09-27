import react from 'react';
import { useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import api from '../axios.js';
import Classification from '../Classification/classification.jsx';
import Projectform from '../project/Projectform.jsx';
import Projectlist from '../project/Projectlist.jsx';
import Navbar from '../navbar.jsx';
export default function Profile() {
   const navigate=useNavigate();
    const [Username,setUsername]=useState('');
    const [Userid,setUserid]=useState('');
    const [Userrole,setUserrole]=useState('');
    const [Userstatus,setUserstatus]=useState('');
    const [UserEmail,setUserEmail]=useState('');
    const [UserCompany,setUserCompany]=useState('');
    const [UserCompanyid,setUserCompanyid]=useState('');
    const [AllPendingUsers,setAllPendingUsers]=useState([]);
    const [approvingUser, setApprovingUser] = useState(null); // Track the user being approved
    const [AllPendingUsersD,setAllPendingUsersD]=useState([]);
    useEffect(()=>{
        api.get("profile")
        .then(res => {
            console.log(res.data)
            setUsername(res.data.name)
            setUserEmail(res.data.email)
            setUserrole(res.data.role)
            setUserstatus(res.data.status)
            setUserid(res.data.id)
            setUserCompany(res.data.company)
            setUserCompanyid(res.data.companyid)
        })
        .catch(err => console.log(err))
    },[])
    console.log(UserCompanyid,UserCompany)
    useEffect(() => {
  api.get("alluser")
    .then(res => {
      console.log("ALL USERS FROM API:", res.data);
      console.log("MY COMPANY ID:", UserCompanyid);

      res.data.forEach(user => {
        // console.log("---- USER ----");
        // console.log("Name:", user.name);
        // console.log(user.id);
        // console.log("Company:", user.company);
        // console.log("Role:", user.role);
        // console.log("Status:", user.status);
        // console.log("Company match:",String(user.company) === String(UserCompanyid));
        // console.log("Role match:",user.role === "MANAGER");
        // console.log("Status match:", user.status === "pending");
        if(String(user.company) === String(UserCompanyid)){
              console.log(user.company,UserCompanyid)
              if(user.status=="pending" && user.role=="MANAGER"){
                setAllPendingUsers(prev => [...prev,user])
              }
            }
      });
    })
    .catch(err => {
      console.log("ERROR:", err);
    });
}, [UserCompanyid]);
    useEffect(()=>{
        api.get("alluser")
        .then(res =>{
          
          res.data.forEach((user)=>{
            console.log("---- USER ----");
        console.log("Name:", user.name);
        console.log(user.id);
        console.log("Company:", user.company);
        console.log("Role:", user.role);
        console.log("Status:", user.status);
        console.log("Company match:",String(user.company) === String(UserCompanyid));
        console.log("Role match:",user.role === "DEVELOPER");
        console.log("Status match:", user.status === "pending");
            console.log(typeof String(user.company),user.company,typeof UserCompanyid,UserCompanyid)
            if(String(user.company) === String(UserCompanyid)){
              console.log(user.company,UserCompanyid)
              if(user.status=="pending" && user.role==="DEVELOPER"){
                setAllPendingUsersD(prev => [...prev,user])
              }
            }
          })
        })
    },[UserCompanyid])
    console.log(AllPendingUsersD);
    const handleclick=(id)=>{
      setApprovingUser(id);
      api.post("approveuser",{id:id})
      .then(res=>{
        alert("User Approved Successfully")
        window.location.reload();
      })
      .catch(err =>{
        setApprovingUser(null);
        console.log(err)
      })
    }
    const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
    };

  return (<>
  <Navbar/>
    <div>
      <h1>Profile</h1>
      <p style={{ color: 'black' }}>Welcome, {Username}!</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ color: 'black' }}><PersonIcon style={{  color: 'black' }} /> {Userrole}</p>
         {Userstatus=='pending' && <p style={{ color: 'black' }}>Your account is pending approval. Wait for some time</p>}
        <p style={{ color: 'black' }}><EmailIcon style={{  color: 'black' }} /> {UserEmail}</p>
        <p style={{ color: 'black' }}><CorporateFareIcon style={{  color: 'black' }} /> {UserCompany}</p>
      </div>
      {Userrole === 'OWNER' && (
        AllPendingUsers.length>0 && <ul>
          {AllPendingUsers.map((user) => (
            <li key={user.id}>
              <p style={{color:'black'}}>{user.name} - {user.email} - {user.role} - {user.status}</p>
              <span><button onClick={()=>handleclick(user.id)} disabled={approvingUser === user.id}> {approvingUser === user.id ? "Approving..." : "Approve"}</button></span>
            </li>
          ))}
        </ul>      )
      }
      {Userrole === 'MANAGER' && (
        AllPendingUsersD.length>0 && <ul>
          {AllPendingUsersD.map((user,idx) => (
            <li key={user.id} style={{display:'flex',alignItems:'self-start',flexDirection:'column',justifyContent:'space-around'}}>
              <p style={{color:'black'}}>{idx+1}. {user.name} </p>
              <p style={{color:'black'}}>Email- {user.email} </p>
              <p style={{color:'black'}}>Role- {user.role} </p>
              <p style={{color:'black'}}>Status- {user.status}</p>
              <span><button onClick={()=>handleclick(user.id)} disabled={approvingUser === user.id}> {approvingUser === user.id ? "Approving..." : "Approve"}</button></span>
            </li>
          ))}
        </ul>      )
      }
      {Userrole === 'OWNER' && (
        <Projectform companyid={UserCompanyid} userid={Userid}/>
      )}
      <Projectlist companyid={UserCompanyid}></Projectlist>
      {/* {Userrole != 'OWNER' && (
        <Classification/>
      )} */}
      <button onClick={logout}>Logout</button>
    </div>
  </>)
}