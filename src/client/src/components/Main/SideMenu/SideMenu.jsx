import React, { useEffect } from "react";
import ProfileCard from "./ProfileCard";
import LogoutIcon from '@mui/icons-material/Logout';
import logoEmpresa from "../../../img/logoEmpresa.png";
import "./styles.css";
import MenuList from "./MenuList";
import { useNavigate } from "react-router-dom";

const SideMenu = () => {
    const navigate = useNavigate();
    const logout = () => {
        sessionStorage.clear();
        navigate("/login");
    }
    return(
        <div className="sidebar-container">
            <ProfileCard/>
            <MenuList/>
            <div className="side-footer">
                <img src={logoEmpresa} alt="logo-empresa"/>
                <button onClick={logout} type="button" className="logout-button">
                    <LogoutIcon/>
                    <p>Salir</p>
                </button>
            </div>
        </div>
    )
}

export default SideMenu;