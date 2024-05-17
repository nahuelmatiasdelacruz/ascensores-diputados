import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const StepOne = ({setDestino,setAutorizante}) => {
    const [loading,setLoading] = useState(false);
    const [destinos,setDestinos] = useState([
        {label: 'Segundo piso',id: 213},
        {label: 'Planta baja',id: 12},
        {label: 'Oficina central',id: 13},
        {label: 'Comedor',id: 14},
        {label: 'Monitoreo',id: 15},
        {label: 'Auditorio',id: 16},
        {label: 'Salas de reuniones',id: 17},
    ])
    const [autorizantes,setAutorizantes] = useState([
        {label: 'Juan Perez',id: 213},
        {label: 'Leonel Medina',id: 12},
        {label: 'Roberto Gomez',id: 13},
        {label: 'Daniel Gonzalez',id: 14},
        {label: 'Juan Pablo Strack',id: 15},
        {label: 'Mariano Montenegro',id: 16},
        {label: 'Sofia Perez',id: 17},
    ]);
    return(
        <div className='step'>
            <Autocomplete
                onChange={(e)=>{setDestino(e.target.value)}}
              disablePortal
              id='select-destino'
              options={destinos}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label='Destino' />}
            />
            <Autocomplete
            onChange={(e)=>{setAutorizante(e.target.value)}}
              disablePortal
              id='select-autorizante'
              options={autorizantes}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label='Autorizante' />}
            />
        </div>
    )
}

export default StepOne;