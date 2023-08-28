import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const DetallesTab = ({userData}) => {
    const [datos,setDatos] = useState(userData);
    const handleConfirmar = () => {

    }
    const handleChangeNombre = (e) => {
      setDatos({
        ...datos,
        nombre: e.target.value.toUpperCase()
      })
    }
    const handleChangeApellido = (e) => {
      setDatos({
        ...datos,
        apellido: e.target.value.toUpperCase()
      })
    }
    const handleChangeSexo = (e) => {
      setDatos({
        ...datos,
        sexo: e.target.value
      })
    }
    const handleChangeDocumento = (e) => {
      setDatos({
        ...datos,
        documento: e.target.value
      })
    }
    const handleChangeCuil = (e) => {
      setDatos({
        ...datos,
        cuil: e.target.value
      })
    }
    const handleChangeTelefono = (e) => {
      setDatos({
        ...datos,
        telefono: e.target.value
      })
    }
    const handleChangeEmail = (e) => {
      setDatos({
        ...datos,
        email: e.target.value
      })
    }
    const handleChangeTipoDoc = (e) => {
      setDatos({
        ...datos,
        documento_tipo_id: e.target.value
      });
    }
    const handleChangeNtramite = (e) => {
      setDatos({
        ...datos,
        numero_tramite: e.target.value
      });
    }
    const handleChangeEjemplar = (e) => {
      setDatos({
        ...datos,
        ejemplar: e.target.value
      });
    }
    const handleChangeNacimiento = (e) => {
      setDatos({
        ...datos,
        fecha_nacimiento: dayjs(e.$d)
      })
    }
    const handleChangeEmision = (e) => {
      setDatos({
        ...datos,
        fecha_emision: dayjs(e.$d)
      })
    }
    useEffect(()=>{
      setDatos(userData);
    },[userData])
    return(
        <div className="detalle-empleado-form">
            <Box component="form" sx={{   '& > :not(style)': { m: 1, width: '30ch' }, }} noValidate autoComplete="off">
                <h4>Datos básicos</h4>
                <TextField onChange={handleChangeNombre} value={datos?.nombre} id="nombre" label="Nombre" variant="outlined" type="text"/>
                <TextField onChange={handleChangeApellido} value={datos?.apellido} id="apellido" label="Apellido" variant="outlined" type="text"/>
                <TextField onChange={handleChangeSexo} id="sexo" select label="Sexo" defaultValue={datos?.sexo}>
                  <MenuItem key="m" value="masculino">Masculino</MenuItem>
                  <MenuItem key="f" value="femenino">Femenino</MenuItem>
                  <MenuItem key="nb" value="nobinario">No Binario</MenuItem>
                </TextField>
                <h4>Documentación</h4>
                <TextField onChange={handleChangeDocumento} value={userData?.documento} id="documento" label="Documento" variant="outlined" type="number"/>
                <TextField onChange={handleChangeCuil} value={userData?.cuil} id="cuil" label="CUIL" variant="outlined" type="text"/>
                <TextField onChange={handleChangeTipoDoc} id="tipo_doc" select label="Tipo documento" defaultValue={datos?.documento_tipo_id}>
                  <MenuItem key="1" value="1">DNI</MenuItem>
                  <MenuItem key="2" value="2">Pasaporte</MenuItem>
                  <MenuItem key="3" value="3">Libreta</MenuItem>
                </TextField>
                <DatePicker format="DD-MM-YYYY" onChange={handleChangeNacimiento} value={dayjs(datos?.fecha_nacimiento) || null} label="Fecha nacimiento"/>
                <h4>Contacto</h4>
                <TextField onChange={handleChangeTelefono} value={userData?.telefono} id="telefono" label="Teléfono" variant="outlined" type="tel"/>
                <TextField onChange={handleChangeEmail} value={userData?.email} id="email" label="Email" variant="outlined" type="mail"/>
            </Box>
        </div>
    )
}

export default DetallesTab;