import React, { useEffect, useState } from 'react';
import ElevatorRoundedIcon from '@mui/icons-material/ElevatorRounded';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { server } from '../../../../helpers/constants';
import toast, { Toaster } from 'react-hot-toast';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import { stylesModal } from '../../../../styles/customStyles';

export const Dispositivos = () => {
    /* Modal controls */
    const [modalSincronizar,setModalSincronizar] = useState(false);
    const [modalEditar,setModalEditar] = useState(false);
    const [modalBorrar,setModalBorrar] = useState(false);
    const [modalAdd,setModalAdd] = useState(false);

    /* Estados generales */
    const [tiposEquipos,setTiposEquipos] = useState([]);
    const [selected,setSelected] = useState({});
    const [loading,setLoading] = useState(false);
    const [dispositivos,setDispositivos] = useState([]);
    const [nuevoDispositivo,setNuevoDispositivo] = useState({
        id: 0,
        nombre: '',
        marca: '',
        tipo: '',
        modelo: '',
        nro_serie: '',
        ip: '',
        puerto: 0,
        usuario: '',
        password: ''
    });
    
    /* Handlers dispositivos */
    const editarDispositivo = (e,data) => {
        setSelected(data);
        setNuevoDispositivo({
            id: data.equipo_id,
            nombre: data.descripcion,
            marca: data.marca,
            modelo: data.modelo,
            nro_serie: data.numero_serie,
            tipo: data.equipo_tipo_id,
            ip: data.ip,
            puerto: data.port,
            usuario: data.usuario,
            password: data.contrasenia
        })
        setModalEditar(true);
    }

    const sincronizarDispositivo = async (e,data) => {
        setSelected(data);
        try
        {
            await axios.post(`${server}/api/dispositivos/syncDevice`,{id : data.equipo_id})
        }catch(e)
        {

        }
    }

    const editarDispositivoRow = (params) => {
        setSelected(params.row);
        setNuevoDispositivo({
            id: params.row.equipo_id,
            nombre: params.row.descripcion,
            marca: params.row.marca,
            modelo: params.row.modelo,
            tipo: params.row.equipo_tipo_id,
            nro_serie: params.row.numero_serie,
            ip: params.row.ip,
            puerto: params.row.port,
            usuario: params.row.usuario,
            password: params.row.contrasenia
        })
        setModalEditar(true);
    }
    const checkEmpty = () => {
        for(let key in nuevoDispositivo){
            if(nuevoDispositivo[key] === ''){
                return true;
            }
        }
        return false;
    }
    const confirmarCambios = async () => {
        const isEmpty = checkEmpty();
        if(isEmpty){
            toast.error('Por favor, complete todos los campos para editar');
            return;
        }
        try{
            await axios.put(`${server}/api/dispositivos`,nuevoDispositivo);
            await getDevices();
            setSelected({});
            setNuevoDispositivo({
                id: 0,
                nombre: '',
                marca: '',
                tipo: '',
                modelo: '',
                nro_serie: '',
                ip: '',
                puerto: 0,
                usuario: '',
                password: ''
            });
            setModalEditar(false);
            toast.success('Se han guardado los cambios correctamente');
        }catch(e){
            toast.error('Hubo un error al editar el dispositivo, contacte el administrador del sistema');
        }
    }
    const closeEditar = () => {
        setModalEditar(false);
    }
    const borrarDispositivo = (e,data) => {
        setSelected(data);
        setModalBorrar(true);
    }
    const handleBorrar = async () => {
        const result = await axios.delete(server+'/api/dispositivos/'+selected.equipo_id);
        await getDevices();
        setModalBorrar(false);
    }
    const addDevice = () => {
        setModalAdd(true);
    }
    const handleAdd = async () => {
        const result = await axios.post(server+'/api/dispositivos',nuevoDispositivo);
        await getDevices();
        handleCloseAdd();
    }
    const handleChangeTipo = (e) => {
        setNuevoDispositivo({
            ...nuevoDispositivo,
            tipo: e.target.value
        });
    }
    const handleChangePassword = (e) => {
        setNuevoDispositivo({
            ...nuevoDispositivo,
            password: e.target.value
        })
    }
    const handleChangeUsuario = (e) => {
        setNuevoDispositivo({
            ...nuevoDispositivo,
            usuario: e.target.value
        })
    }
    const handleChangePuerto = (e) => {
        setNuevoDispositivo({
            ...nuevoDispositivo,
            puerto: e.target.value
        })
    }
    const handleChangeIp = (e) => {
        setNuevoDispositivo({
            ...nuevoDispositivo,
            ip: e.target.value
        })
    }
    const handleChangeSerie = (e) => {
        setNuevoDispositivo({
            ...nuevoDispositivo,
            nro_serie: e.target.value
        })
    }
    const handleChangeModelo = (e) => {
        setNuevoDispositivo({
            ...nuevoDispositivo,
            modelo: e.target.value
        })
    }
    const handleChangeNombre = (e) => {
        setNuevoDispositivo({
            ...nuevoDispositivo,
            nombre: e.target.value
        })
    }
    const handleChangeMarca = (e) => {
        setNuevoDispositivo({
            ...nuevoDispositivo,
            marca: e.target.value
        })
    }
    const handleCloseAdd = () => {
        setModalAdd(false);
    }
    const handleCloseBorrar = () => {
        setModalBorrar(false);
    }

    const handleSincronizar = () => {
        setModalSincronizar(false);
    }

    const handleCloseSincronizar = () => {
        setModalSincronizar(false);
    }
    /* Configuración de la tabla */
    const gridColumns = [
        {field: 'descripcion', headerName: 'Descripción', width: 200},
        {field: 'ip', headerName: 'IP', width: 200},
        {field: 'port',headerName: 'Puerto', width: 200},
        {field: 'marca',headerName: 'Marca', width: 200},
        {field: 'modelo',headerName: 'Modelo', width: 200},
        {filed: 'registro_activo',headerName: 'Estado', width: 150,renderCell: (params)=>{
            return(
                params.row.registro_activo === true ? <Chip label='Activo' color='success' size='small'/> : <Chip label='Inactivo' color='warning' size='small'/>
            )
        }},
        {field: 'actions',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{
                        e.stopPropagation();
                        sincronizarDispositivo(e,params.row)}} color='error' aria-label='sync'>
                        <EditIcon/>
                    </IconButton>

                    <IconButton onClick={(e)=>{
                        e.stopPropagation();
                        editarDispositivo(e,params.row)}} color='success' aria-label='edit'>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{
                        e.stopPropagation();
                        borrarDispositivo(e,params.row)}} color='error' aria-label='delete'>
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    /* DB Read/Write */
    const getDevices = async () => {
        setLoading(true);
        const devices = await axios.get(server+'/api/dispositivos');
        const parsed = devices.data.map((device)=>{
            return {
                ...device,
                id: device.equipo_id
            }
        })
        const tipos = await axios.get(server+'/api/dispositivos/tipos_equipos');
        setTiposEquipos(tipos.data);
        setDispositivos(parsed);
        setLoading(false);
    }
    useEffect(()=>{
        getDevices();
    },[])
    return(
        <>
        <Toaster/>
            <Modal open={modalEditar} onClose={closeEditar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>Editar el equipo <span>{selected.descripcion}</span>:</h1>
                    <Box sx={{display: 'flex',flexDirection: 'column',justifyContent: 'space-between', height: '600px', marginBottom: 4}}>
                        <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                            <h4 style={{color: '#1282a2ff'}}>Detalle</h4>
                            <TextField value={nuevoDispositivo?.nombre} onChange={handleChangeNombre} size='small' id='descripcion' label='Nombre' variant='outlined' type='text'/>
                            <TextField value={nuevoDispositivo?.marca} onChange={handleChangeMarca} size='small' id='marca' label='Marca' variant='outlined' type='text'/>
                            <TextField value={nuevoDispositivo?.modelo} onChange={handleChangeModelo} size='small' id='modelo' label='Modelo' variant='outlined' type='text'/>
                            <TextField value={nuevoDispositivo?.nro_serie} onChange={handleChangeSerie} size='small' id='numero-serie' label='Serie' variant='outlined' type='text'/>
                            <TextField value={nuevoDispositivo?.tipo} onChange={handleChangeTipo} size='small' id='select-tipo' select label='Tipo de equipo'>
                                {
                                    tiposEquipos.map(tipo=>{
                                        return(
                                            <MenuItem key={tipo.equipo_tipo_id} value={tipo.equipo_tipo_id}>{tipo.descripcion}</MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Box>
                        <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                            <h4 style={{color: '#1282a2ff'}}>Conexión</h4>
                            <TextField value={nuevoDispositivo.ip} onChange={handleChangeIp} size='small' id='ip' label='IP' variant='outlined' type='text'/>
                            <TextField value={nuevoDispositivo.puerto} onChange={handleChangePuerto} size='small' id='puerto' label='Puerto' variant='outlined' type='number'/>
                        </Box>
                        <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                            <h4 style={{color: '#1282a2ff'}}>Acceso</h4>
                            <TextField value={nuevoDispositivo.usuario} onChange={handleChangeUsuario} size='small' id='usuario' label='Usuario' variant='outlined' type='text'/>
                            <TextField value={nuevoDispositivo.password} onChange={handleChangePassword} size='small' id='password' label='Contraseña' variant='outlined' type='password'/>
                        </Box>
                    </Box>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={confirmarCambios} color='success' variant='outlined'>Confirmar cambios</Button>
                        <Button onClick={closeEditar} color='error' variant='outlined'>Cancelar</Button>
                    </Stack>
                </Box>
            </Modal>

            {/* Modal borrar Dispositivo */}
            <Modal open={modalBorrar} onClose={handleCloseBorrar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>¿Confirma que desea borrar el equipo?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={handleBorrar} color='success' variant='outlined'>Si</Button>
                        <Button onClick={handleCloseBorrar} color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>

            {/* Modal Añadir Dispositivo */}
            <Modal open={modalAdd} onClose={handleCloseAdd} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>Añadir equipo</h1>
                    <Box sx={{display: 'flex',flexDirection: 'column',justifyContent: 'space-between', height: '600px', marginBottom: 4}}>
                        <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                            <h4 style={{color: '#1282a2ff'}}>Detalle</h4>
                            <TextField onChange={handleChangeNombre} size='small' id='descripcion' label='Nombre' variant='outlined' type='text'/>
                            <TextField onChange={handleChangeMarca} size='small' id='marca' label='Marca' variant='outlined' type='text'/>
                            <TextField onChange={handleChangeModelo} size='small' id='modelo' label='Modelo' variant='outlined' type='text'/>
                            <TextField onChange={handleChangeSerie} size='small' id='numero-serie' label='Serie' variant='outlined' type='text'/>
                            <TextField onChange={handleChangeTipo} size='small' id='select-tipo' select label='Tipo de equipo' value={nuevoDispositivo?.tipo}>
                                {
                                    tiposEquipos.map(tipo=>{
                                        return(
                                            <MenuItem key={tipo.equipo_tipo_id} value={tipo.equipo_tipo_id}>{tipo.descripcion}</MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Box>
                        <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                            <h4 style={{color: '#1282a2ff'}}>Conexión</h4>
                            <TextField onChange={handleChangeIp} size='small' id='ip' label='IP' variant='outlined' type='text'/>
                            <TextField onChange={handleChangePuerto} size='small' id='puerto' label='Puerto' variant='outlined' type='number'/>
                        </Box>
                        <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                            <h4 style={{color: '#1282a2ff'}}>Acceso</h4>
                            <TextField onChange={handleChangeUsuario} size='small' id='usuario' label='Usuario' variant='outlined' type='text'/>
                            <TextField onChange={handleChangePassword} size='small' id='password' label='Contraseña' variant='outlined' type='password'/>
                        </Box>
                    </Box>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={handleAdd} color='success' variant='outlined'>Confirmar</Button>
                        <Button onClick={handleCloseAdd} color='error' variant='outlined'>Cancelar</Button>
                    </Stack>
                </Box>
            </Modal>
            <div className='content-header'>
                <ElevatorRoundedIcon sx={{fontSize: 40}}/>
                <h3>Equipos</h3>
            </div>
            <DataGrid
                disableRowSelectionOnClick={true}
                onRowClick={editarDispositivoRow}
                sx={{height: '80%'}}
                loading={loading}
                rows={dispositivos}
                columns={gridColumns}
                autoPageSize
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <Button sx={{marginTop: '20px'}} onClick={addDevice} variant='outlined' startIcon={<AddIcon/>}>Añadir dispositivo</Button>
        </>
    )
};