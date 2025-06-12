import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function RequireSubscription() {
    const { isLoggedIn, role, data } = useSelector((state) => state.auth);

    // Check if user is subscribed
    const isSubscribed = data?.subscription?.status === 'ACTIVE' || 
                        data?.subscription?.status === 'active' ||
                        role === 'ADMIN';

    // If not logged in, redirect to login
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    // If logged in but not subscribed, redirect to checkout
    if (!isSubscribed) {
        return <Navigate to="/checkout" />;
    }

    // If subscribed, render the protected component
    return <Outlet />;
}

export default RequireSubscription;