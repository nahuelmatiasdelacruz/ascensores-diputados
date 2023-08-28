import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import dayjs from "dayjs";
import 'dayjs/locale/es';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Toaster, toast } from "react-hot-toast";

const StepOne = ({datos,setDatos}) => {
    const [cargaAutomatica,setCargaAutomatica] = useState(true);
    const [scannedData,setScannedData] = useState('');
    const inactiveTime = 1000;
    let temp = null;
    const handleChangeCarga = () => {
        setCargaAutomatica(!cargaAutomatica);
        setDatos({...datos,tipo_carga: cargaAutomatica ? "A" : "M"});
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
            sexo_id: e.target.value
        });
    }
    const handleChangeDoc = (e) => {
        setDatos({
            ...datos,
            documento: e.target.value
        })
    }
    const handleChangeTipoDoc = (e) => {
        setDatos({
            ...datos,
            documento_tipo_id: e.target.value
        })
    }
    const handleChangeTramite = (e) => {
        setDatos({
            ...datos,
            numero_tramite: e.target.value
        })
    }
    const handleChangeEjemplar = (e) => {
        setDatos({
            ...datos,
            ejemplar: e.target.value
        })
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
    const handleChangeTelefono = (e) => {
        setDatos({
            ...datos,
            telefono: e.target.value
        })
    }
    const handleChangeCorreo = (e) => {
        setDatos({
            ...datos,
            correo: e.target.value
        })
    }
    const handleChangeCuil = (e) => {
        setDatos({
            ...datos,
            cuil: e.target.value
        })
    }
    const startScann = (e) => {
        setScannedData(e.target.value);
        setDatos({
            ...datos,
            documento: e.target.value
        });
    }
    const whatSex = (s) => {
        let value = 1;
        switch(s){
            case "M":
                value = 1;
                break;
            case "F":
                value = 2;
                break;
            default:
                value = 3;
                break;
        }
        return value;
    }
    const reverseDate = (date) => {
        const dateJs = dayjs(date,"DD-MM-YYYY").format();
        const formatted = dayjs(dateJs);
        return formatted;
    }
    useEffect(() => {
        if(temp){
            clearTimeout(temp);
        }
        temp = setTimeout(()=>{
            if(scannedData){
                const scanned = scannedData.split('"');
                if(scanned.length > 1){
                    setDatos({
                        ...datos,
                        numero_tramite: datos[0],
                        apellido: datos[1],
                        nombre: datos[2],
                        sexo: whatSex(datos[3]),
                        documento: datos[4],
                        ejemplar: datos[5],
                        tipo_carga: "A",
                        fecha_nacimiento: reverseDate(datos[6]),
                        fecha_emision: reverseDate(datos[7])
                    });
                }else{
                    setCargaAutomatica(false);
                    setDatos({
                        ...datos,
                        tipo_carga: "M"
                    });
                }
            }
        },inactiveTime);
        return () => {
            clearTimeout(temp);
        }
    },[scannedData]);
    return(
        <div className="step">
            <Toaster/>
            <div className="tipo-carga">
                <h4>Carga de datos: <span className={cargaAutomatica ? "auto" : "manual"}>{cargaAutomatica ? "Automatica" : "Manual"}</span></h4>
                <Switch checked={cargaAutomatica} onClick={handleChangeCarga}/>
            </div>
            <div className="">
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },marginTop:3}} autoComplete="off">
                    {
                        cargaAutomatica ? 
                        <TextField InputLabelProps={{ shrink: true }} autoFocus onChange={startScann} type="text" size="small" id="documento" label="Documento" variant="outlined" required/>
                        :
                        <TextField InputLabelProps={{ shrink: true }} value={datos?.documento} onChange={handleChangeDoc} type="number" size="small" id="documento" label="Documento" variant="outlined" required/>
                    }
                    <TextField InputLabelProps={{ shrink: true }} value={datos?.numero_tramite} onChange={handleChangeTramite} type="number" size="small" id="nrotramite" label="Nro tramite" variant="outlined"/>
                    <TextField InputLabelProps={{ shrink: true }} value={datos?.ejemplar} onChange={handleChangeEjemplar} type="text" size="small" id="ejemplar" label="Ejemplar" variant="outlined"/>
                </Box>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },marginTop:3}} autoComplete="off">
                    <TextField InputLabelProps={{ shrink: true }} value={datos?.nombre} onChange={handleChangeNombre} size="small" id="nombre" label="Nombre" variant="outlined" required/>
                    <TextField InputLabelProps={{ shrink: true }} value={datos?.apellido} onChange={handleChangeApellido} size="small" id="apellido" label="Apellido" variant="outlined" required/>
                </Box>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },marginTop:3}} autoComplete="off">
                    <TextField InputLabelProps={{ shrink: true }} onChange={handleChangeSexo} size="small" id="sexo" select label="Sexo" defaultValue={1}>
                        <MenuItem key="masculino" value={1}>Masculino</MenuItem>
                        <MenuItem key="femenino" value={2}>Femenino</MenuItem>
                        <MenuItem key="nobinario" value={3}>No binario</MenuItem>
                    </TextField>
                    <TextField onChange={handleChangeTipoDoc} size="small" id="tipodoc" select label="Tipo documento" defaultValue={1}>
                        <MenuItem key="dni" value={1}>DNI</MenuItem>
                        <MenuItem key="tipo2" value={2}>Tipo 2</MenuItem>
                        <MenuItem key="tipo3" value={3}>Tipo 3</MenuItem>
                    </TextField>
                </Box>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },marginTop:3,marginBottom:3}} autoComplete="off">
                    <DatePicker InputLabelProps={{ shrink: true }} format="DD-MM-YYYY" value={datos?.fecha_nacimiento || null} slotProps={{textField: {size: "small"}}} label="Fecha nacimiento" onChange={handleChangeNacimiento} sx={{marginBottom: "15px"}}/>
                    <DatePicker InputLabelProps={{ shrink: true }} format="DD-MM-YYYY" value={datos?.fecha_emision || null} slotProps={{textField: {size: "small"}}} label="Fecha emisión" onChange={handleChangeEmision} sx={{marginBottom: "15px"}}/>
                </Box>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },marginTop:3,marginBottom:3}} autoComplete="off">
                      <TextField value={datos?.cuil} onChange={handleChangeCuil} type="number" size="small" id="cuil" label="CUIL" variant="outlined"/>
                </Box>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },marginTop:3,marginBottom: 3}} autoComplete="off">
                    <TextField value={datos?.correo} onChange={handleChangeCorreo} type="mail" size="small" id="correo" label="Correo" variant="outlined"/>
                    <TextField value={datos?.telefono} onChange={handleChangeTelefono} type="phone" size="small" id="telefono" label="Teléfono" variant="outlined"/>
                </Box>
            </div>
        </div>
    )
}

export default StepOne;