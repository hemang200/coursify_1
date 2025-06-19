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
import CheckoutSuccess from "./Pages/Payment/CheckoutSuccess.jsx";
import CheckoutFailure from "./Pages/Payment/CheckoutFailure.jsx";
import Displaylectures from "./Pages/Dashboard/Displaylectures.jsx";
import RequireSubscription from "./Components/Auth/RequireSubscription";
import AddLecture from "./Pages/Dashboard/Addlecture.jsx";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard.jsx";
import ChangePassword from "./Pages/User/ChangePassword.jsx";
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
      
        {/* Admin only routes */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          {/* Uncomment when you have these components */}
          <Route path="/course/addlecture" element={<AddLecture />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

             {/* Routes that require login */}
         <Route element={<RequireAuth allowedRoles={["admin", "user"]} />}>
          <Route path='/user/profile' element={<Profile />} />
          <Route path='/user/editprofile' element={<EditProfile />} />
          <Route path='/changepassword' element={<ChangePassword />} />

          <Route path='/checkout' element={<Checkout />} />
           <Route path='/checkout/success' element={<CheckoutSuccess />} />
           <Route path='/checkout/fail' element={<CheckoutFailure />} />
           
           {/* Routes that require subscription (nested inside RequireAuth) */}
          <Route element={<RequireSubscription />}>
            <Route path='/course/displaylectures' element={<Displaylectures />} />
          </Route>
        </Route>

         <Route path="*" element={<NotFound />}></Route>
        </Route>
     </Routes>
    
    </>
  )
}

export default App
