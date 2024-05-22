import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import NoPhoto from '../../../../../img/nophoto.webp';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { InputLabel } from '@mui/material';
import axios from 'axios';
import { server } from '../../../../../helpers/constants';

const StepTwo = ({datos,setDatos}) => {
    const [sectores,setSectores] = useState([]);
    const [tiposHabilitaciones,setTiposHabilitaciones] = useState([]);
    const [periodos,setPeriodos] = useState([]);
    const handleChangePeriodo = (e) => {
        setDatos({
            ...datos,
            habilitacion: {
                ...datos.habilitacion,
                periodo_legislativo: e.target.value
            }
        })
    }
    const handleChangeDesde = (e) => {
        setDatos({
            ...datos,
            habilitacion: {
                ...datos.habilitacion,
                fechaDesde: dayjs(e.$d)
            }
        });
    }
    const handleChangeHasta = (e) => {
        setDatos({
            ...datos,
            habilitacion: {
                ...datos.habilitacion,
                fechaHasta: dayjs(e.$d)
            }
        });
    }
    const handleChangeObservaciones = (e) => {
        setDatos({
            ...datos,
            habilitacion: {
                ...datos.habilitacion,
                observaciones: e.target.value.toUpperCase()
            }
        });
    }
    const handleChangeNocturno = (e) => {
        setDatos({
            ...datos,
            habilitacion: {
                ...datos.habilitacion,
                turno_noche: !datos.habilitacion.turno_noche
            }
        })
    }
    const handleChangeHabilitacion = (e) => {
        setDatos({
            ...datos,
            habilitacion: {
                ...datos.habilitacion,
                tipo: e.target.value
            }
        });
    }
    const handleSelectSector = (e,newValue) => {
        setDatos({
            ...datos,
            habilitacion: {
                ...datos.habilitacion,
                sector: newValue
            }
        });
    }
    const handleSelectTipo = (e,newValue) => {
        setDatos({
            ...datos,
            habilitacion: {
                ...datos.habilitacion,
                tipo: newValue
            }
        })
    }
    const getSectores = async () => {
        const result = await axios.get(`${server}/api/empleados/sectores`);
        setSectores(result.data);
    }
    const getTiposHabilitaciones = async () => {
        try{
            const result = await axios.get(`${server}/api/empleados/tipos`);
            setTiposHabilitaciones(result.data);
        }catch(e){
            console.log(e.message);
            setTiposHabilitaciones([]);
        }
    }
    const getPeriodos = async () => {
        try{
            const response = await axios.get(`${server}/api/configuracion/periodos`);
            setPeriodos(response.data);
        }catch(e){
            console.log(e.message);
        }
    }
    useEffect(()=>{
        getTiposHabilitaciones();
        getSectores();
        getPeriodos();
    },[])
    return(
        <div className='step'>
            <Box component='form' sx={{marginTop:3,marginBottom: 3}} autoComplete='off'>
                <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                    <Autocomplete
                            value={datos?.habilitacion?.tipo || null}
                            onChange={handleSelectTipo}
                            size='small'
                            disablePortal
                            clearOnBlur={true}
                            clearOnEscape={true}
                            id='combo-box'
                            options={tiposHabilitaciones}
                            sx={{width: '250px'}}
                            renderInput={(params)=><TextField {...params} label='Tipo'/>}
                            />
                    <DesktopDateTimePicker format='DD-MM-YYYY HH:mm' value={datos?.habilitacion?.fechaDesde || null} slotProps={{textField: {size: 'small'}}} label='Fecha de inicio' onChange={handleChangeDesde} sx={{width:200, marginBottom: '15px'}}/>
                    <DesktopDateTimePicker format='DD-MM-YYYY HH:mm' value={datos?.habilitacion?.fechaHasta || null} slotProps={{textField: {size: 'small'}}} label='Fecha de finalización' onChange={handleChangeHasta} sx={{width:200, marginBottom: '15px'}}/>
                </div>
                <div style={{width: '100%', marginTop: 20}}>
                    <TextField sx={{width: '20%'}} InputLabelProps={{ shrink: true }} onChange={handleChangePeriodo} size='small' id='periodo' select label='Periodo legislativo' defaultValue={1}>
                        {
                            periodos.map((periodo)=>{
                                return <MenuItem key={periodo.id} value={periodo.id}>{periodo.descripcion}</MenuItem>
                            })
                        }
                    </TextField>
                </div>
                <div style={{width: '100%', marginTop: 20}}>
                    <Autocomplete
                        value={datos?.habilitacion?.sector || null}
                        onChange={handleSelectSector}
                        size='small'
                        disablePortal
                        clearOnBlur={true}
                        clearOnEscape={true}
                        id='combo-box' 
                        options={sectores} 
                        sx={{ width: '80%' }}
                        renderInput={(params) => <TextField {...params} label='Sector'/>}
                    />
                </div>
                <FormControlLabel value={datos?.habilitacion?.turno_noche || false} sx={{marginTop: 5, marginBottom: 5}} control={<Switch onChange={handleChangeNocturno}/>} label='Turno noche / Feriados' />
                <div style={{display: 'flex', width: '100%', marginTop: 20}}>
                    <TextField value={datos?.habilitacion?.observaciones || ''} sx={{width: '80%'}} size='small' label='Observaciones' onChange={handleChangeObservaciones}/>
                </div>
            </Box>
        </div>
    )
}

export default StepTwo;