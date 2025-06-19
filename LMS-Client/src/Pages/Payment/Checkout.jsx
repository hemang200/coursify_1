import { useEffect } from "react";
import toast from "react-hot-toast";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from '../../Layouts/HomeLayout';
import { getRazorPayId, purchaseCourseBundle, verifyUserPayment } from "../../Redux/Slices/RazorPaySlice";
import { getUserData } from "../../Redux/Slices/AuthSlice";
import Displaylectures from "../Dashboard/Displaylectures";


function Checkout() {
    // const user = useSelector((state) => state.auth.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const razorpayKey = useSelector((state) => state?.razorpay?.key);
    // const subscription_id = useSelector((state) => state?.razorpay?.subscription_id);
    const order_id = useSelector((state) => state?.razorpay?.order_id);

    const isPaymentVerified = useSelector((state) => state?.razorpay?.isPaymentVerified);
    const userData = useSelector((state) => state?.auth?.data);
    const { role } = useSelector((state) => state.auth);
    
    // Check if user is already subscribed
    const isSubscribed = userData?.subscription?.status === 'ACTIVE' || 
                        userData?.subscription?.status === 'active' ||
                        role === 'admin';

    const paymentDetails = {
        razorpay_payment_id: "",
        razorpay_order_id: "",
        razorpay_signature: ""
    }

    async function handleSubscription(e) {
        try {
             e.preventDefault();

        if (!razorpayKey || !order_id) {
       toast.error("Something went wrong");
       return;
      }

        const options = {
            key: razorpayKey,
            // subscription_id: subscription_id,
               order_id: order_id,
               amount: 50000, // INR 500 in paise
                currency: "INR",
            name: "Coursify Pvt. Ltd.",
            description: "Subscription",
            theme: {
                color: '#F37254'
            },
            prefill: {
                email: userData.email,
                name: userData.fullName,
            },
            
            
            handler: async function (response) {
                 console.log("Payment response:", response);
                 // Create payment details object with correct mapping
                    const paymentDetails = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id || order_id, // Use order_id from state if not in response
                        razorpay_signature: response.razorpay_signature
                    };

                    console.log("Payment details being sent:", paymentDetails);
                

                    try {
                        const res = await dispatch(verifyUserPayment(paymentDetails));
                        console.log("Verification response:", res);
                        
                        // Check for successful verification more thoroughly
                        if (res?.payload?.success === true || res?.meta?.requestStatus === 'fulfilled') {
                            // Refresh user data to get updated subscription status
                            await dispatch(getUserData());
                            toast.success("Payment successful! You now have access to all courses.");
                            navigate("/checkout/success");
                        } else {
                            console.error("Verification failed:", res);
                            toast.error("Payment verification failed. Please contact support.");
                            navigate("/checkout/fail");
                        }
                    } catch (verificationError) {
                        console.error("Verification error:", verificationError);
                        toast.error("Payment verification failed. Please contact support.");
                        navigate("/checkout/fail");
                    }
            
        },
       modal: {
                    ondismiss: function() {
                        toast.error("Payment cancelled");
                    }
                }
        }
            
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Error during payment:", error);
            toast.error("Payment failed. Please try again.");
        }
    }
       

    async function load() {
        try {
            await dispatch(getRazorPayId());
            await dispatch(purchaseCourseBundle());
        } catch (error) {
            console.error("Failed to load payment data:", error);
            toast.error("Failed to initialize payment");
        }
    }

    // useEffect(() => {
    //     load();
    // }, []);

   useEffect(() => {
        // Reset payment state when component mounts
        // dispatch(resetPaymentState());
        
        // If user is already subscribed, redirect to courses
        if (isSubscribed) {
            toast.success("You already have an active subscription!");
           if (role === 'admin') {
            navigate("/course/displaylectures"); // or whatever your display lectures route is
        }
            else navigate("/courses");
            return;
        }

        load().then(() => {
            console.log("razorpayKey:", razorpayKey);
            console.log("order_id:", order_id);
        });
    }, []);

    // If already subscribed, show message
    if (isSubscribed) {
        return (
         
                <div className="min-h-[90vh] flex items-center justify-center text-white">
                    <div className="text-center space-y-4">
                        <div className="text-3xl font-bold text-green-500">
                            ✅ Already Subscribed!
                        </div>
                        <div className="text-xl text-gray-300">
                            You already have access to all courses
                        </div>
                        <button 
                           onClick={() => {
                        if (role === 'admin') {
                            navigate("/course/displaylectures"); // or your display lectures route
                        } else {
                            navigate("/courses");
                        }
                    }}
                            className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 px-6 py-3 rounded-lg text-xl font-bold text-black"
                        >
                            Browse Courses
                        </button>
                    </div>
                </div>
            
        );
    }


    return (
   
            <form
                onSubmit={handleSubscription}
                className="min-h-[90vh] flex items-center justify-center text-white"
            >
                <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
                    <h1 className="bg-yellow-500 absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl0lg rounded-tr-lg">Subscription Bundle</h1>
                    <div className="px-4 space-y-5 text-center">
                        <p className="text-[17px]">
                            This purchase will allow you to access all available course
                            of our platform for {" "} 
                            <span className="text-yellow-500 font-bold">
                                <br />
                                1 Year duration
                            </span> { " " }
                            All the existing and new launched courses will be also available
                        </p>

                        <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                            <BiRupee /><span>499</span> only
                        </p>
                        <div className="text-gray-200">
                            <p>100% refund on cancellation</p>
                            <p>* Terms and conditions applied *</p>
                        </div>
                        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full left-0 text-xl font-bold rounded-bl-lg rounded-br-lg py-2">
                            Buy now
                        </button>
                    </div>
                </div>

            </form>
       
    );
    
}

export default Checkout;