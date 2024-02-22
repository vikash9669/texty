import React from "react";
import { Navigate, Outlet } from 'react-router-dom';
export default function ProtectedRoute() {
    // const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("user.token") !== null || false;
    // console.log(isLoggedIn)
    return isLoggedIn ? <Outlet /> : <Navigate to={"/sign_in"}/>;
    }