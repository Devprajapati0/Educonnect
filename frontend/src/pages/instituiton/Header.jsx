import React from 'react'
import { Button, Typography } from "@mui/material";
import { SchoolOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {useSelector,useDispatch} from "react-redux"
import { useNavigate } from "react-router-dom"
import { removeInstitute } from '../../store/slice/instituteSlice';
import axios from 'axios';
import { FRONTEND_URL } from '../../helpers/url';
import toast from 'react-hot-toast';


function Header() {
    const authStatus = useSelector((state) => state.institute.isActive)
    const dispatch = useDispatch()
    const navigate = useNavigate()
   const navITem = [
  {
      name:'Features',
      path:'/features',
      acive:true,
  },
  {
      name:'Pricing',
      path:'/pricing',
      acive:true,
  },
  {
      name:'About',
      path:'/about',
      acive:true,
  },
  {
      name:'Log In',
      path:'/login',
      acive:!authStatus,
  },
  {
      name:'Sign Up',
      path:'/signup',
      acive:!authStatus,
  },
  {
    name:'Profile',
    path:'/profile',
    acive:authStatus,
  },
  {
    name:'Logout',
    path:'/logout',
    acive:authStatus,
  },
  ]

  const handleClick = async() => {
    const data = await axios.post(`${FRONTEND_URL}institution/logout-institution`,{},{
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    console.log("data",data)
    toast.success(data.data.message)
    dispatch(removeInstitute())
    navigate('/')
  }

  return (
    <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <SchoolOutlined style={{ color: "#1976d2" }} />
      <Typography variant="h6">  <Button component={Link} to="/" color="inherit">EduConnect</Button></Typography>
    </div>
    <div style={{ display: "flex", gap: "15px" }}>
    {
  navITem.map((item) => 
    item.acive && (
      <div key={item.name}>
        {item.name === 'Logout' ? (
          <button
            onClick={handleClick}
            className='inline-block px-6 py-2 duration-200 hover:bg-red-500 rounded-full text-white bg-red-600'
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate(item.path)}
            className='inline-block px-6 py-2 duration-200 hover:bg-blue-500 rounded-full text-white bg-blue-600'
          >
            {item.name}
          </button>
        )}
      </div>
    )
  )
}
    </div>
  </header>
  )
}


export default Header