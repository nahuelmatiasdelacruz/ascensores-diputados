import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DetallesTab = ({userData,setUserData}) => {
    const handleChangeInput = (e,prop) => {
      setUserData({
        ...userData,
        [prop]: e.target.value
      })
    }
    const handleChangeNacimiento = (e) => {
      setUserData({
        ...userData,
        fecha_nacimiento: dayjs(e.$d)
      })
    }
    return(
        <div className="detalle-empleado-form">
            <Box component="form" sx={{   '& > :not(style)': { m: 1, width: '30ch' }, }} noValidate autoComplete="off">
                <h4>Datos básicos</h4>
                <TextField onChange={(e)=>{handleChangeInput(e,"nombre")}} value={userData?.nombre} id="nombre" label="Nombre" variant="outlined" type="text"/>
                <TextField onChange={(e)=>{handleChangeInput(e,"apellido")}} value={userData?.apellido} id="apellido" label="Apellido" variant="outlined" type="text"/>
                <TextField onChange={(e)=>{handleChangeInput(e,"sexo")}} id="sexo" select label="Sexo" defaultValue={userData?.sexo}>
                  <MenuItem key="m" value="masculino">Masculino</MenuItem>
                  <MenuItem key="f" value="femenino">Femenino</MenuItem>
                  <MenuItem key="nb" value="nobinario">No Binario</MenuItem>
                </TextField>
                <h4>Documentación</h4>
                <TextField onChange={(e)=>{handleChangeInput(e,"documento")}} value={userData?.documento} id="documento" label="Documento" variant="outlined" type="number"/>
                <TextField onChange={(e)=>{handleChangeInput(e,"cuil")}} value={userData?.cuil} id="cuil" label="CUIL" variant="outlined" type="text"/>
                <TextField onChange={(e)=>{handleChangeInput(e,"documento_tipo_id")}} id="tipo_doc" select label="Tipo documento" defaultValue={userData?.documento_tipo_id}>
                  <MenuItem key="1" value="1">DNI</MenuItem>
                  <MenuItem key="2" value="2">Pasaporte</MenuItem>
                  <MenuItem key="3" value="3">Libreta</MenuItem>
                </TextField>
                <DatePicker format="DD-MM-YYYY" onChange={handleChangeNacimiento} value={dayjs(userData?.fecha_nacimiento) || null} label="Fecha nacimiento"/>
                <h4>Contacto</h4>
                <TextField onChange={(e)=>{handleChangeInput(e,"telefono")}} value={userData?.telefono} id="telefono" label="Teléfono" variant="outlined" type="tel"/>
                <TextField onChange={(e)=>{handleChangeInput(e,"email")}} value={userData?.email} id="email" label="Email" variant="outlined" type="mail"/>
            </Box>
        </div>
    )
}

export default DetallesTab;