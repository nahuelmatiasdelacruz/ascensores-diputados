import React, { useState } from 'react';
import loadingGif from '../../img/loadingCircle.gif';
import logoEmpresa from '../../img/logoEmpresa.png';
import fondoDiputados from '../../img/diputados.jpg';
import toast, { Toaster } from 'react-hot-toast';
import '../../styles/styles.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../helpers/constants';

const Login = ({setLoggedIn}) => {
    const navigate = useNavigate();
    const [user,setUser] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const onChangeUser = (e) => {
        setUser(e.target.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const result = await axios.post(`${server}/api/auth`,{user,password});
            sessionStorage.setItem('x-token',result.data.token);
            sessionStorage.setItem('userName',result.data.userData.userName);
            setLoading(false);
            setLoggedIn(true);
            navigate('/');
        }catch(e){
            console.log(e);
            toast.error(e.response.data.msg);
            setLoading(false);
            return;
        }
    }
    return(
        <>
            <Toaster/>
            <div className='main-login'>
                <form className='login-form'>
                    <img src={logoEmpresa} alt='Logo Empresa'/>
                    <div className='input-container'>
                        <label>Usuario</label>
                        <input onChange={onChangeUser} type='text' value={user} required/>
                    </div>
                    <div className='input-container'>
                        <label>Password</label>
                        <input onChange={onChangePassword} type='password' value={password} required/>
                    </div>
                    {
                        loading ? 
                        <button type='submit' disabled className='submit loading'>
                            <img src={loadingGif} alt='loading..'/>
                        </button>
                        :
                        <button type='submit' className='submit' onClick={handleSubmit}>Iniciar sesión</button> 
                    }
                </form>
            </div>
        </>
    )
}

export default Login;