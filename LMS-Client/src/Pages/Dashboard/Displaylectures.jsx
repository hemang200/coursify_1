// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";

// import HomeLayout from "../../Layouts/HomeLayout";
// import { deleteCourseLecture, getCourseLectures } from "../../Redux/Slices/LectureSlice";

// function Displaylectures() {

//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const {state} = useLocation();
//     const {lectures} = useSelector((state) => state.lecture);
//     const {role} = useSelector((state) => state.auth);

//     const [currentVideo, setCurrentVideo] = useState(0);

//     async function onLectureDelete(courseId, lectureId) {
//         console.log(courseId, lectureId);
//         await dispatch(deleteCourseLecture({courseId: courseId, lectureId: lectureId}));
//         await dispatch(getCourseLectures(courseId));
//     }

//     useEffect(() => {
//         console.log(state);
//         if(!state) navigate("/courses");
//         dispatch(getCourseLectures(state._id));
//     }, []);

//     return (
    
//             // <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-wihte mx-[5%]">
//             //     <div className="text-center text-2xl font-semibold text-yellow-500">
//             //         Course Name: {state?.title}
//             //     </div>

//             //     {(lectures && lectures.length > 0 ) ?  
//             //         (<div className="flex justify-center gap-10 w-full">
//             //         {/* left section for playing videos and displaying course details to admin */}
//             //        <div className="space-y-5 w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">
//             //             <video 
//             //                 src={lectures && lectures[currentVideo]?.lecture?.secure_url}
//             //                 className="object-fill rounded-tl-lg rounded-tr-lg w-full"   
//             //                 controls
//             //                 disablePictureInPicture
//             //                 muted
//             //                 controlsList="nodownload"

//             //             >
//             //             </video>    
//             //             <div>
//             //                 <h1>
//             //                     <span className="text-yellow-500"> Title: {" "}
//             //                     </span>
//             //                     {lectures && lectures[currentVideo]?.title}
//             //                 </h1>
//             //                 <p>
//             //                     <span className="text-yellow-500 line-clamp-4">
//             //                         Description: {" "}
//             //                     </span>
//             //                     {lectures && lectures[currentVideo]?.description}
//             //                 </p>
//             //             </div>
//             //        </div>

//             //        {/* right section for displaying list of lectres */}
//             //        <ul className="w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">
//             //             <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
//             //                 <p>Lectures list</p>
//             //                 {role === "ADMIN" && (
//             //                     <button onClick={() => navigate("/course/addlecture", {state: {...state}})} className="btn-primary px-2 py-1 rounded-md font-semibold text-sm">
//             //                         Add new lecture
//             //                     </button>
//             //                 )}
//             //             </li> 
//             //             {/* {lectures && 
//             //                 lectures.map((lecture, idx) => {
//             //                     return (
//             //                         <li className="space-y-2" key={lecture._id} >
//             //                             <p className="cursor-pointer" onClick={() => setCurrentVideo(idx)}>
//             //                                 <span>
//             //                                     {" "} Lecture {idx + 1} : {" "}
//             //                                 </span>
//             //                                 {lecture?.title}
//             //                             </p>
//             //                             {role === "ADMIN" && (
//             //                                 <button onClick={() => onLectureDelete(state?._id, lecture?._id)} className="btn-accent px-2 py-1 rounded-md font-semibold text-sm">
//             //                                     Delete lecture
//             //                                 </button>
//             //                             )}
//             //                         </li>
//             //                     )
//             //                 })    
//             //             } */}
//             //        </ul>
//             //     </div>) : (
//             //         role === "ADMIN" && (
//             //             <button onClick={() => navigate("/course/addlecture", {state: {...state}})} className="btn-primary px-2 py-1 rounded-md font-semibold text-sm">
//             //                 Add new lecture
//             //             </button>
//             //         )
//             //     )}
//             // </div>

//             <div>hellow</div>
    
//     );
// }

// export default Displaylectures;






import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourseLecture, getCourseLectures } from "../../Redux/Slices/LectureSlice";

function Displaylectures() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { lectures } = useSelector((state) => state.lecture);
    const { role, data: userData } = useSelector((state) => state.auth);

    const [currentVideo, setCurrentVideo] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is subscribed
    const isSubscribed = userData?.subscription?.status === 'ACTIVE' || 
                        userData?.subscription?.status === 'active' ||
                        userData?.role === 'admin';

    async function onLectureDelete(courseId, lectureId) {
        // console.log("course id");
        
        // console.log(courseId, lectureId);
        // console.log(lectures[currentVideo]?.lecture?.secure_url);

        await dispatch(deleteCourseLecture({ courseId: courseId, lectureId: lectureId }));
        await dispatch(getCourseLectures(courseId));
    }

    useEffect(() => {
        // console.log(state);
        if (!state) {
            navigate("/courses");
            return;
        }

        // If user is not subscribed, redirect to checkout
        if (!isSubscribed) {
            navigate("/checkout");
            return;
        }

        async function fetchLectures() {
            setIsLoading(true);
            await dispatch(getCourseLectures(state._id));
            setIsLoading(false);
        }

        fetchLectures();
    }, [state, isSubscribed, dispatch, navigate]);


    useEffect(() => {
    if (lectures && lectures.length > 0) {
        // console.log("Fetched lectures:", lectures);
        // console.log("Current video URL:", lectures[currentVideo]?.lecture?.secure_url);
    }
}, [lectures, currentVideo]);


    // If user is not subscribed, show subscription required message
    if (!isSubscribed) {
        return (
       
                <div className="min-h-[90vh] flex items-center justify-center text-white">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-yellow-500">
                            Subscription Required
                        </h2>
                        <p className="text-lg">
                            You need an active subscription to access course lectures.
                        </p>
                        <button
                            onClick={() => navigate("/checkout")}
                            className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 px-6 py-2 rounded-md font-semibold"
                        >
                            Subscribe Now
                        </button>
                    </div>
                </div>
         
        );
    }

    if (isLoading) {
        return (
        
                <div className="min-h-[90vh] flex items-center justify-center text-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
                        <p className="mt-4 text-lg">Loading lectures...</p>
                    </div>
                </div>
            
        );
    }

    return (
       
            <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white mx-[5%]">
                <div className="text-center text-2xl font-semibold text-yellow-500">
                    Course Name: {state?.title}
                </div>

                {(lectures && lectures.length > 0) ? (
                    <div className="flex justify-center gap-10 w-full">
                        {/* left section for playing videos and displaying course details */}
                        <div className="space-y-5 w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">
                            <video
                                src={lectures &&  (
      lectures[currentVideo]?.lecture?.secure_url ||
      lectures[currentVideo]?.secure_url || ""
    )}
                              
                              

                                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                                controls
                                disablePictureInPicture
                                muted
                                controlsList="nodownload"
                                autoPlay
                            >
                                  Your browser does not support the video tag.
                            </video>
                             
                            <div>
                                <h1>
                                    <span className="text-yellow-500"> Title: {" "}
                                    </span>
                                    {lectures && lectures[currentVideo]?.title}
                                </h1>
                                <p>
                                    <span className="text-yellow-500 line-clamp-4">
                                        Description: {" "}
                                    </span>
                                    {lectures && lectures[currentVideo]?.description}
                                </p>
                            </div>
                        </div>

                        {/* right section for displaying list of lectures */}
                        <ul className="w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">
                            <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                                <p>Lectures list</p>
                                {role === "admin" && (
                                    <button 
                                        onClick={() => navigate("/course/addlecture", { state: { ...state } })} 
                                        className="btn-primary px-2 py-1 rounded-md font-semibold text-sm"
                                    >
                                        Add new lecture
                                    </button>
                                )}
                            </li>
                            {lectures &&
                                lectures.map((lecture, idx) => {
                                    return (
                                        <li className="space-y-2" key={lecture._id}>
                                            <p 
                                                className="cursor-pointer hover:text-yellow-500 transition-colors"
                                                onClick={() => setCurrentVideo(idx)}
                                            >
                                                <span>
                                                    {" "} Lecture {idx + 1} : {" "}
                                                </span>
                                                {lecture?.title}
                                            </p>
                                            {role === "admin" && (
                                                <button 
                                                    onClick={() => onLectureDelete(state?._id, lecture?._id)} 
                                                    className="btn-accent px-2 py-1 rounded-md font-semibold text-sm bg-red-500 hover:bg-red-600 text-white"
                                                >
                                                    Delete lecture
                                                </button>
                                            )}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <p className="text-lg text-gray-300">No lectures available for this course yet.</p>
                        {role === "admin" && (
                            <button 
                                onClick={() => navigate("/course/addlecture", { state: { ...state } })} 
                                className="btn-primary px-4 py-2 rounded-md font-semibold text-sm bg-yellow-500 hover:bg-yellow-600"
                            >
                                Add new lecture
                            </button>
                        )}
                    </div>
                )}
            </div>
     
    );
}

export default Displaylectures;