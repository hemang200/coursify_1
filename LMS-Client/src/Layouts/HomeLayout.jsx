
import React from "react";
import {AiFillCloseCircle} from 'react-icons/ai';
import {FiMenu} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link,Outlet,useNavigate } from 'react-router-dom';

import Footer from '../Components/Footer';
import {logout} from '../Redux/Slices/AuthSlice';
// import { logout } from '../Redux/Slices/AuthSlice';
function HomeLayout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // // for checking if user is logged in
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    // // for displaying the options acc to role
    const role = useSelector((state) => state?.auth?.role);

    // function changeWidth() {
    //     const drawerSide = document.getElementsByClassName("drawer-side");
    //     drawerSide[0].style.width = 'auto';
    // }

    // function hideDrawer() {
    //     const element = document.getElementsByClassName("drawer-toggle");
    //     element[0].checked = false;

    //     const drawerSide = document.getElementsByClassName("drawer-side");
    //     drawerSide[0].style.width = '0';
    // }

    async function handleLogout(e) {
        e.preventDefault();

        const res = await dispatch(logout());
        if(res?.payload?.success)
        navigate("/");
    }

    return (
        // <div className="min-h-[90vh]">
        //     <div className="drawer absolute left-0 z-50 w-fit">
        //         <input className="drawer-toggle" id="my-drawer" type="checkbox" />
        //         <div className="drawer-content">
        //             <label htmlFor="my-drawer" className="cursor-pointer relative">
        //                 <FiMenu 
        //                     onClick={changeWidth}
        //                     size={"32px"}
        //                     className="font-bold text-white m-4"
        //                 />
        //             </label>
        //         </div>
                
        //     </div>

        //       <div className="drawer-side w-0">
        //             <label htmlFor="my-drawer" className="drawer-overlay">
        //             </label>
        //             <ul className="menu p-4 w-48 sm:w-80 bg-base-100 text-base-content relative">
        //                 <li className="w-fit absolute right-2 z-50">
        //                     <button onClick={hideDrawer}>
        //                         <AiFillCloseCircle size={24} />
        //                     </button>
        //                 </li>
        //                 <li>
        //                     <Link to="/">Home</Link>
        //                 </li>

                        // { {isLoggedIn && role === 'ADMIN' && (
                        //     <li>
                        //         <Link to="/admin/dashboard"> Admin DashBoard</Link>
                        //     </li>
                        // )}
                        // {isLoggedIn && role === 'ADMIN' && (
                        //     <li>
                        //         <Link to="/course/create"> Create new course</Link>
                        //     </li>
                        // )} }

        //                 <li>
        //                     <Link to="/courses">All Courses</Link>
        //                 </li>

        //                 <li>
        //                     <Link to="/contact">Contact Us</Link>
        //                 </li>

        //                 <li>
        //                     <Link to="/about">About Us</Link>
        //                 </li>

        //                 {/* {!isLoggedIn && (
        //                     <li className="absolute bottom-4 w-[90%]">
        //                         <div className="w-full flex items-center justify-center">
        //                             <button className='btn-primary px-4 py-1 font-semibold rounded-md w-full'>
        //                                 <Link to="/login">Login</Link>
        //                             </button>
        //                             <button className='btn-secondary px-4 py-1 font-semibold rounded-md w-full'>
        //                                 <Link to="/signup">Signup</Link>
        //                             </button>
        //                         </div>
        //                     </li>
        //                 )}

        //                 {isLoggedIn && (
        //                     <li className="absolute bottom-4 w-[90%]">
        //                         <div className="w-full flex items-center justify-center">
        //                             <button className='btn-primary px-4 py-1 font-semibold rounded-md w-full'>
        //                                 <Link to="/user/profile">Profile</Link>
        //                             </button>
        //                             <button className='btn-secondary px-4 py-1 font-semibold rounded-md w-full'>
        //                                 <Link onClick={handleLogout}>Logout</Link>
        //                             </button>
        //                         </div>
        //                     </li>
        //                 )} */}
        //             </ul>
        //         </div>

        //     {/* { children } */}
        //                <Outlet />
        //     <Footer />
        // </div>








 <div className="min-h-[90vh] flex flex-col">
            <div className="drawer">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Hamburger menu */}
                    <label htmlFor="my-drawer" className="cursor-pointer m-4 block">
                        <FiMenu size={32} className="font-bold text-white" />
                    </label>
                    {/* Main page content */}
                    <Outlet />
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-64 bg-base-100 text-base-content min-h-full">
                        <li className="w-fit absolute right-2 z-50">
                            <label htmlFor="my-drawer" className="cursor-pointer">
                                <AiFillCloseCircle size={24} />
                            </label>
                        </li>
                        <li><Link to="/">Home</Link></li>
                        {isLoggedIn && role === 'admin' && (
                            <li>
                                <Link to="/admin/dashboard"> Admin DashBoard</Link>
                            </li>
                        )}

                            {isLoggedIn && role === 'admin' && (
                            <li>
                                <Link to="/course/create"> Create new course</Link>
                            </li>
                        )}

                        <li><Link to="/courses">All Courses</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                         {/* {!isLoggedIn && (
                            <li className="absolute bottom-4 w-[90%]">
                                <div className="w-full flex items-center justify-center">
                                    <button className='btn-primary px-4 py-1 font-semibold rounded-md w-full'>
                                        <Link to="/login">Login</Link>
                                    </button>
                                    <button className='btn-secondary px-4 py-1 font-semibold rounded-md w-full'>
                                        <Link to="/signup">Signup</Link>
                                    </button>
                                </div>
                            </li>
                        )} */}


                        {!isLoggedIn && (
    <li className="absolute bottom-4 w-[90%] left-1/2 -translate-x-1/2">
        <div className="w-full flex items-center justify-center gap-2">
            <Link to="/login" className="w-1/2">
                <button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 font-semibold rounded-md cursor-pointer"
                >
                    Login
                </button>
            </Link>
            <Link to="/signup" className="w-1/2">
                <button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 font-semibold rounded-md cursor-pointer"
                >
                    Signup
                </button>
            </Link>
        </div>
    </li>
)}

                          {isLoggedIn && (
    <li className="absolute bottom-4 w-[90%] left-1/2 -translate-x-1/2">
        <div className="w-full flex items-center justify-center gap-2">
            <Link to="/user/profile" className="w-1/2">
                <button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 font-semibold rounded-md cursor-pointer"
                >
                    Profile
                </button>
            </Link>
            <button
                onClick={handleLogout}
                className="w-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 font-semibold rounded-md cursor-pointer"
            >
                Logout
            </button>
        </div>
    </li>
)}
                    </ul>
                </div>
            </div>
            {/* {children} */}
            <Footer />
        </div>



    );
}

export default HomeLayout;