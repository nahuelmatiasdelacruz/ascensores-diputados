import React, { useEffect, useState } from 'react';
import NoProfilePhoto from '../../../img/no-profile2.png';
import {Tooltip,IconButton,HomeIcon} from '../../';
import { useNavigate } from 'react-router-dom';

const ProfileCard = () => {
    const [user,setUser] = useState('');
    const navigate = useNavigate();
    useEffect(()=>{
        const userName = sessionStorage.getItem('userName');
        setUser(userName);
    },[])
    return(
        <div className='profile-card'>
            <img src={NoProfilePhoto} alt='Profile Photo'/>
            <div className='profile-data'>
                <p className='profile-name'>{user}</p>
                <p className='profile-type'>Administrador</p>
            </div>
            <Tooltip title='Inicio'>
                <IconButton color='primary' onClick={()=>{navigate('/')}}>
                    <HomeIcon/>
                </IconButton>
            </Tooltip>
        </div>
    )
}

export default ProfileCard;