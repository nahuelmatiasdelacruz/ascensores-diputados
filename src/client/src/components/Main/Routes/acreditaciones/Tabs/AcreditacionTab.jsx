import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const AcreditacionTab = ({data}) => {
    return(
        <div className='acreditacion-form'>
            <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                <h4>Datos básicos</h4>
                <TextField id='nombre' label='Nombre' variant='outlined' type='text'/>
                <TextField id='apellido' label='Apellido' variant='outlined' type='text'/>
                <TextField id='sexo' select label='Sexo' defaultValue='masculino'>
                  <MenuItem key='m' value='masculino'>Masculino</MenuItem>
                  <MenuItem key='f' value='femenino'>Femenino</MenuItem>
                  <MenuItem key='nb' value='nobinario'>No Binario</MenuItem>
                </TextField>
                <h4>Documentación</h4>
                <TextField id='documento' label='Documento' variant='outlined' type='number'/>
                <TextField id='pasaporte' label='Pasaporte' variant='outlined' type='number'/>
                <TextField id='nrotramite' label='Nro Tramite' variant='outlined' type='number'/>
                <TextField id='ejemplar' label='Ejemplar' variant='outlined' type='text'/>
                <TextField id='fechanac' variant='outlined' helperText='Fecha de nacimiento' type='date'/>
                <TextField id='fechaem' variant='outlined' helperText='Fecha de emision' type='date'/>
                <TextField id='cuil' label='CUIL' variant='outlined' type='text'/>
                <h4>Contacto</h4>
                <TextField id='telefono' label='Teléfono' variant='outlined' type='tel'/>
                <TextField id='email' label='Email' variant='outlined' type='mail'/>
                <h4>Observaciones</h4>
                <TextField id='observaciones' label='Observaciones' variant='outlined' multiline type='text'/>
            </Box>
            <Stack direction='row' spacing={5} marginTop='30px' justifyContent='center'>
                <Button color='success' variant='outlined'>Confirmar cambios</Button>
                <Button color='error' variant='outlined'>Cancelar</Button>
            </Stack>
        </div>
    )
}

export default AcreditacionTab;