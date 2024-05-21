import React from 'react';
import ProfileCard from './ProfileCard';
import LogoutIcon from '@mui/icons-material/Logout';
import logoEmpresa from '../../../img/logoEmpresa.png';
import './styles.css';
import MenuList from './MenuList';
import { useDispatch } from 'react-redux';
import { startLogout } from '../../../store/auth/thunks';

const SideMenu = () => {
    const dispatch = useDispatch();
    const onLogout = () => {
      dispatch(startLogout());
    }
    return(
        <div className='sidebar-container'>
            <ProfileCard/>
            <MenuList/>
            <div className='side-footer'>
                <img src={logoEmpresa} alt='logo-empresa'/>
                <button onClick={onLogout} type='button' className='logout-button'>
                    <LogoutIcon/>
                    <p>Salir</p>
                </button>
            </div>
        </div>
    )
}

export default SideMenu;