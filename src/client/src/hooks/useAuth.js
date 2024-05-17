import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const {status} = useSelector(state=>state.auth);
  const dispatch = useDispatch();
  useEffect(()=>{

  },[])
  return status;
}
