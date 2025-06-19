import React from "react";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance"
const dataFromStorage = localStorage.getItem('data');
const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    // data: localStorage.getItem('data') !=  {}
    // data: localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {},
     data: dataFromStorage && dataFromStorage !== "undefined" ? JSON.parse(dataFromStorage) : {},
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("user/register", data);
        toast.promise(res, {
            loading: "Wait! creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account"
        });
        console.log(res);
        
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})

export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("user/login", data);
        toast.promise(res, {
            loading: "Wait! authentication in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log in"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const res = axiosInstance.post("user/logout");
        toast.promise(res, {
            loading: "Wait! logout in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            
            
            error: "Failed to log out"
        });
        console.log(res);
        
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});



export const getUserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = axiosInstance.get("user/me");
        return (await res).data;
    } catch(error) {
        toast.error(error.message);
    }
})

export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
    try {
        const res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
        toast.promise(res, {
            loading: "Wait! profile update in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update profile"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/user/change-password", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Action to update subscription status after successful payment
export const updateSubscriptionStatus = createAsyncThunk("/auth/updateSubscription", async (subscriptionData) => {
    try {
        // This will refetch user data to get updated subscription status
        const res = await axiosInstance.get("user/me");
        return res.data;
    } catch(error) {
        console.error("Error updating subscription status:", error);
        throw error;
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {// Manual action to update subscription status
        setSubscriptionStatus: (state, action) => {
            if (state.data) {
                state.data.subscription = action.payload;
                localStorage.setItem("data", JSON.stringify(state.data));
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
        })
        .addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.data = {};
            state.isLoggedIn = false;
            state.role = "";
        })
        .addCase(getUserData.fulfilled, (state, action) => {
            if(!action?.payload?.user) return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role
        })
        .addCase(updateSubscriptionStatus.fulfilled, (state, action) => {
            if(!action?.payload?.user) return;
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            state.data = action?.payload?.user;
            console.log("Subscription status updated:", action?.payload?.user?.subscription);
        })
    }
})

export const { setSubscriptionStatus  } = authSlice.actions;
export default authSlice.reducer;