import React from "react";
import { useNavigate } from "react-router-dom";
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ElevatorRoundedIcon from '@mui/icons-material/ElevatorRounded';

import "./styles.css";

const MenuList = () => {
    const navigate = useNavigate();
    return(
        <div className="menu-list">
            <div className="menu-title">
                <PeopleAltRoundedIcon/>
                <h4>Usuarios</h4>
            </div>
            <div className="menu-content">
                <button type="button" className="menu-link" onClick={()=>{navigate("/gestion-empleados/empleados")}}>Usuarios habilitados</button>
                {/* <button type="button" className="menu-link" onClick={()=>{navigate("/gestion-empleados/credenciales")}}>Credenciales</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/gestion-empleados/tipos-credencial")}}>Tipos de credencial</button> */}
            </div>
            <div className="menu-title">
                <ElevatorRoundedIcon/>
                <h4>Dispositivos</h4>
            </div>
            <div className="menu-content">
                <button type="button" className="menu-link" onClick={()=>{navigate("/equipos/grupos")}}>Grupos de acceso</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/equipos")}}>Dispositivos</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/equipos/marcaciones")}}>Marcaciones</button>
            </div>
            <div className="menu-title">
                <SupervisorAccountRoundedIcon/>
                <h4>Administración</h4>
            </div>
            <div className="menu-content">
                <button type="button" className="menu-link" onClick={()=>{navigate("/administracion/usuarios")}}>Usuarios</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/administracion/permisos")}}>Permisos</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/administracion/roles")}}>Roles</button>
            </div>
            <div className="menu-title">
                <SettingsSuggestIcon/>
                <h4>Configuración</h4>
            </div>
            <div className="menu-content">
                <button type="button" className="menu-link" onClick={()=>{navigate("/configuracion/sectores")}}>Sectores</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/configuracion/tipos")}}>Tipos</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/configuracion/periodos")}}>Periodos</button>
            </div>
            <div className="menu-title">
                <BadgeRoundedIcon/>
                <h4>Acreditaciones</h4>
            </div>
                <div className="menu-content">
                <button type="button" className="menu-link" onClick={()=>{navigate("/acreditaciones/acreditaciones")}}>Acreditaciones</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/acreditaciones/empresas-organismos")}}>Empresas y organismos</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/acreditaciones/tipos-bien")}}>Tipos de bienes</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/acreditaciones/tipos-habilitacion")}}>Tipos de habilitación</button>
            </div>
            {/*<div className="menu-title">
                <HomeWorkRoundedIcon/>
                <h4>Gestión de espacios</h4>
            </div>
            <div className="menu-content">
                <button type="button" className="menu-link" onClick={()=>{navigate("/gestion-espacios/espacios")}}>Espacios</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/gestion-espacios/oficinas")}}>Oficinas</button>
            </div>
            <div className="menu-title">
                <CorporateFareRoundedIcon/>
                <h4>Molinetes</h4>
            </div>
            <div className="menu-content">
                <button type="button" className="menu-link" onClick={()=>{navigate("/molinetes/enroladores")}}>Enroladores</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/molinetes/equipos")}}>Equipos</button>
            </div>
            <div className="menu-title">
                <AssessmentRoundedIcon/>
                <h4>Visitas</h4>
            </div>
            <div className="menu-content">
                <button type="button" className="menu-link" onClick={()=>{navigate("/reportes-visitas")}}>Reportes de visitas</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/visitas/carga-visitas")}}>Cargar visitas</button>
                <button type="button" className="menu-link" onClick={()=>{navigate("/visitas/registro-visitas")}}>Registro de visitas</button>
            </div> */}
        </div>
    )   
}

export default MenuList;