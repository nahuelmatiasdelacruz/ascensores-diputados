import React, { useEffect, useState } from "react";
import NoProfilePhoto from "../../../img/no-profile2.png";
import { MUIButtons, MUIDisplay, MUIIcons } from "../../../helpers/MaterialImports";
import { useNavigate } from "react-router-dom";

const ProfileCard = () => {
    const [user,setUser] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
        const userName = sessionStorage.getItem("userName");
        setUser(userName);
    },[])
    return(
        <div className="profile-card">
            <img src={NoProfilePhoto} alt="Profile Photo"/>
            <div className="profile-data">
                <p className="profile-name">{user}</p>
                <p className="profile-type">Administrador</p>
            </div>
            <MUIDisplay.Tooltip title="Inicio">
                <MUIButtons.IconButton color="primary" onClick={()=>{navigate("/")}}>
                    <MUIIcons.HomeIcon/>
                </MUIButtons.IconButton>
            </MUIDisplay.Tooltip>
        </div>
    )
}

export default ProfileCard;