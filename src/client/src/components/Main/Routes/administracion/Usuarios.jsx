import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import KeyIcon from '@mui/icons-material/Key';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import toast, {Toaster} from 'react-hot-toast';
import { stylesModal } from '../../../../styles/customStyles';

export const Usuarios = () => {
    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
      ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[600],
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
          opacity: 1,
          transition: theme.transitions.create(['background-color'], {
            duration: 500,
          }),
        },
      }));
      
    const [loading,setLoading] = useState(false);
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [openEditar,setOpenEditar] = useState(false);
    const [selectedRow,setSelectedRow] = useState({});
    const [openBorrar,setOpenBorrar] = useState(false);
    const [usuarios,setUsuarios] = useState([]);
    const addUsuario = () => {
        setOpenModalAdd(true);
    }
    const handleCloseEditar = () => {
        setOpenEditar(false);
    }
    const handleCloseAdd = () => {
        setOpenModalAdd(false);
    }
    const handleCloseBorrar = () =>{
        setOpenBorrar(false);
    }
    const borrarUsuario = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenBorrar(true);
    }
    const editarUsuario = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenEditar(true);
    }
    const usuariosColumns = [
        {field: 'usuario', headerName: 'Usuario', width:200},
        {field: 'nombre', headerName: 'Usuario', width:200},
        {field: 'email', headerName: 'Usuario', width:200},
        {field: 'habilitado',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Habilitado',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked={params.row.estado}/>}/>
                </Stack>
            )
        }},
        {field: 'roles',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Roles',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <IconButton aria-label='delete'>
                    <KeyIcon />
                </IconButton>
            )
        }},
        {field: 'acciones',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                <IconButton onClick={(e)=>{editarUsuario(e,params.row)}} color='success' aria-label='edit'>
                    <EditIcon/>
                </IconButton>
                <IconButton onClick={(e)=>{borrarUsuario(e,params.row)}} color='error' aria-label='delete'>
                    <DeleteIcon/>
                </IconButton>
            </Stack>
            )
        }},
    ]

    return(
        <Box>
            <Modal open={openBorrar} onClose={handleCloseBorrar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>¿Confirma que desea borrar el usuario?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button color='success' variant='outlined'>Si</Button>
                        <Button color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={openEditar} onClose={handleCloseEditar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>Editar usuario</h1>
                    <TextField sx={{marginBottom: '10px'}} id='usuario' label='Usuario' variant='outlined' type='text'/>
                    <TextField sx={{marginBottom: '10px'}} id='nombre' label='Nombre' variant='outlined' type='text'/>
                    <TextField sx={{marginBottom: '10px'}} id='email' select label='Email' variant='outlined' type='text'/>
                </Box>
            </Modal>
            <div className='content-header'>
                <SupervisedUserCircleIcon sx={{fontSize: 40}}/>
                <h3>Usuarios</h3>
            </div>
            <DataGrid
            disableRowSelectionOnClick={true}
                sx={{margin: '0'}}
                loading={loading}
                rows={usuarios}
                columns={usuariosColumns}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <Button sx={{marginTop: '20px'}} onClick={addUsuario} variant='outlined' startIcon={<AddIcon/>}>Añadir usuario</Button>
        </Box>
    )
};