import React from 'react';
import loadingGif from '../../img/loadingCircle.webp';
import { useSelector } from 'react-redux';

export const SubmitButton = () => {
  const {isLoading,onLogin} = useSelector(state=>state.auth);
  return (
    <button type="submit" disabled={isLoading} className={`submit ${isLoading && 'loading'}`} onClick={onLogin}>
      {isLoading ? <img src={loadingGif} alt="loading.." /> : 'Iniciar sesión'}
    </button>
  )
};