import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const storedData = JSON.parse(localStorage.getItem("profileData")) || {};

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: storedData.name || user?.name || "",
    email: storedData.email || user?.email || "",
    phone: storedData.phone || user?.phone || "",
    password: "",
    profilePhoto: storedData.profilePhoto || user?.profilePhoto || "https://via.placeholder.com/150",
  });

  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return <p className="text-center text-gray-600 mt-20">No user information available.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-2xl">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-indigo-700">Your Profile</h2>
          <p className="text-lg text-gray-500">Manage your profile details</p>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.profilePhoto}
            alt="Profile"
            className="h-32 w-32 rounded-full border-4 border-indigo-500 shadow-lg"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-3 text-sm text-gray-600"
            />
          )}
        </div>

        {/* Profile Details */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          {["name", "email", "phone", "password"].map((field) => (
            <div key={field} className="mb-4">
              <label className="block font-semibold text-gray-700 capitalize">
                {field}:
              </label>
              {editMode ? (
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={field === "password" ? formData.password : formData[field]}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-lg text-gray-900">{field === "password" ? "******" : formData[field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
              editMode ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {editMode ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
