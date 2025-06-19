import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../Redux/Slices/AuthSlice"; // You’ll create this next
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await dispatch(changePassword(formData));
    if (res?.payload?.success) {
      toast.success("Password changed successfully");
      navigate("/user/profile");
    } else {
      toast.error(res?.payload?.message || "Failed to change password");
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-md shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Change Password</h2>

        <div>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            id="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600"
            required
          />
        </div>

        <button type="submit" className="w-full bg-yellow-600 py-2 rounded hover:bg-yellow-500 transition">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
