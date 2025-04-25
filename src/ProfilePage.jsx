import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth, sendPasswordResetEmail } from "./firebase";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching user:", err));
    // console.log(user.profileImage);
  }, []);

  useEffect(() => {
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!userId) return;

    axios.get(`http://localhost:5000/api/users/${userId}`).then((res) => {
      const img = new Image();
      img.onload = () => setUser(res.data);
      img.src = res.data.profileImage || "/default-profile.png";
    });
  }, []);

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setDialogMessage("Password reset email sent! Please check your inbox.");
    } catch (error) {
      setDialogMessage("Error: " + error.message);
    } finally {
      setIsLoading(false);
      setShowDialog(true);
    }
  };

  const closeDialog = () => setShowDialog(false);

  const fileInputRef = React.useRef();

  const handleImageClick = () => {
    fileInputRef.current.click(); // triggers file input when image is clicked
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      const userId =
        localStorage.getItem("userId") || sessionStorage.getItem("userId");

      axios
        .put(`http://localhost:5000/api/users/${userId}/profile-image`, {
          image: base64String,
        })
        .then((res) => {
          setUser((prevState) => ({
            ...prevState,
            profileImage: res.data.profileImage, // assuming this is the correct field
          }));
        });
    };
    reader.readAsDataURL(file);
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="expense-tracker-wrapper font-helvetica relative">
      {/* Top Menubar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-blue-600 text-white shadow-md h-15">
        <button
          onClick={() => navigate("/")}
          className="text-white hover:scale-110 transition-transform"
        >
          <FaArrowLeft size={25} />
        </button>
        <h1 className="text-xl font-bold">Your Profile</h1>
        <div style={{ width: "25px" }}></div>
      </div>

      {/* Profile Box */}
      <div className="flex justify-center mt-10 font-helvetica">
        <div className="bg-white shadow-lg rounded-xl p-6 w-[90%] max-w-md border border-gray-200">
          <div className="text-center">
            <img
              src={user.profileImage || "/default-profile.png"}
              alt="Profile"
              className="mx-auto h-24 w-24 rounded-full object-cover mb-4 cursor-pointer"
              onClick={handleImageClick}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            <h2 className="text-xl text-gray-1500 font-bold capitalize mb-1">
              Username: {user.username || "N/A"}
            </h2>
            <p className="text-red-700 text-lg font-semibold mb-1">
              Email: {user.email}
            </p>
            <p className="text-gray-600 text-md font-normal mb-1 capitalize">
              Signed up via {user.provider}
            </p>
            <p className="text-sm text-gray-500-lg font-bold mb-1">
              Registered on: {formatDate(user.registrationTime)}
            </p>

            <button
              onClick={handleForgotPassword}
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-red-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Dialog Message */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg text-center">
            <p className="text-gray-800 mb-4">{dialogMessage}</p>
            <button
              onClick={closeDialog}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
