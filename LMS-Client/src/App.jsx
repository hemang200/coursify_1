import React from "react";
import { useState } from 'react'
import './index.css'
import { Route,Routes } from 'react-router-dom'
import Footer from './Components/Footer'
import HomeLayout from './Layouts/HomeLayout'
import HomePage from './Pages/HomePage'
import AboutUs from './Pages/AboutUs'
import NotFound from "./Pages/NotFound";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import CourseList from "./Pages/Course/CourseList";
import Contact from "./Pages/Contact";
import Denied from "./Pages/Denied";
import CourseDescription from "./Pages/Course/CourseDescription";
import RequireAuth from "./Components/Auth/RequireAuth";
import CreateCourse from "./Pages/Course/CreateCourse";
import EditProfile from "./Pages/User/EditProfile";
import Profile from "./Pages/User/Profile";
import Checkout from "./Pages/Payment/Checkout.jsx";
// import Displaylectures from "./Pages/Dashboard/Displaylectures.jsx";
function App() {
  return (
    <>
     {/* <h1>LMS</h1> */}
     <Routes>
       <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/denied" element={<Denied />} />
          <Route path="/course/description" element={<CourseDescription />} />
       
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          {/* <Route path="/course/addlecture" element={<AddLecture />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        </Route>

         <Route element={<RequireAuth allowedRoles={["admin", "user"]} />}>
          <Route path='/user/profile' element={<Profile />} />
          <Route path='/user/editprofile' element={<EditProfile />} />
          <Route path='/checkout' element={<Checkout />} />
           {/* <Route path='/checkout/success' element={<CheckoutSuccess />} />
          <Route path='/checkout/fail' element={<CheckoutFailure />} /> */}
          {/* // <Route path='/course/displaylectures' element={<Displaylectures />}/> */}
        </Route>

         <Route path="*" element={<NotFound />}></Route>
        </Route>
     </Routes>
    
    </>
  )
}

export default App
