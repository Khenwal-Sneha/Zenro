import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import ShowListingPage from "./pages/ShowListingPage";
import CreateListingPage from "./pages/CreateListingPage";
import EditListingPage from "./pages/EditListingPage";
import ProfilePage from "./pages/ProfilePage";
import MyProfilePage from "./pages/MyProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UploadProfilePicPage from "./pages/UploadProfilePicPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<HomePage />} />

        {/* LISTINGS */}
        <Route path="/listings/:id" element={<ShowListingPage />} />
        <Route path="/listings/new" element={<CreateListingPage />} />
        <Route path="/listings/:id/edit" element={<EditListingPage />} />

        {/* PROFILE */}
        
        {/* 🔥 CURRENT USER PROFILE */}
        <Route path="/profile" element={<MyProfilePage />} />

        {/* 🔥 OTHER USER PROFILE (IMPORTANT FIX) */}
        <Route path="/profile/:username" element={<ProfilePage />} />

        {/* 🔥 UPLOAD PROFILE PIC */}
        <Route path="/profile/:username/pfp" element={<UploadProfilePicPage />} />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ERROR */}
        <Route
          path="*"
          element={<ErrorPage err={{ status: 404, message: "Page Not Found" }} />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;