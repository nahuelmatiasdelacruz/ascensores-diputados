import '../../styles/styles.css';
import React from 'react';
import logoEmpresa from '../../img/logoEmpresa.png';
import loadingGif from '../../img/loadingGif.gif';
import { Toaster } from 'react-hot-toast';
import { useForm } from '../../hooks';
import { useDispatch, useSelector } from 'react-redux';
import { startLogin } from '../../store/auth/thunks';

export const Login = () => {
  const dispatch = useDispatch();
  const {isCheckingCredentials} = useSelector((state) => state.auth);
  const {user = '',password = '',onInputChange} = useForm({ user: '', password: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(startLogin({user,password}));
  };
  return (
    <>
      <Toaster />
      <div className="main-login">
        <form className="login-form">
          <img src={logoEmpresa} alt="Logo Empresa" />
          <div className="input-container">
            <label>Usuario</label>
            <input
              onChange={onInputChange}
              name="user"
              type="text"
              value={user}
              required
            />
          </div>
          <div className="input-container">
            <label>Password</label>
            <input
              onChange={onInputChange}
              name="password"
              type="password"
              value={password}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isCheckingCredentials}
            className={`submit ${isCheckingCredentials && 'loading'}`}
            onClick={onSubmit}>
            {isCheckingCredentials ? (<img src={loadingGif} alt="loading.." />) : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </>
  );
};
