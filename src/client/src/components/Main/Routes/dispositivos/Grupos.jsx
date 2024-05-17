import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { server } from '../../../../helpers/constants';
// Componentes MUI
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import toast, { Toaster } from 'react-hot-toast';
import SpeakerGroupIcon from '@mui/icons-material/SpeakerGroup';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Chip from '@mui/material/Chip';
import { stylesModal } from '../../../../styles/customStyles';

const Grupos = () => {
    // Estados del componente
    const [inputValue,setInputValue] = useState('');
    const [devices,setDevices] = useState([]);
    const [modalAgregarGrupo,setModalAgregarGrupo] = useState(false);
    const [modalBorrarGrupo,setModalBorrarGrupo] = useState(false);
    const [modalEditarGrupo,setModalEditarGrupo] = useState(false);
    const [loading,setLoading] = useState(false);
    const [selectedGroup,setSelectedGroup] = useState({});
    const [loadingGroupData,setLoadingGroupData] = useState(false);
    const [grupos,setGrupos] = useState([]);
    const [nombreNuevo,setNombreNuevo] = useState('');
    const [deviceListForGroup,setDeviceListForGroup] = useState([]);
    const [currentGroupDevices,setCurrentGroupDevices] = useState([]);
    const [modalEditarNombre,setModalEditarNombre] = useState(false); 
    // Handlers
    const filtrarDatos = async (id) => {
        setLoadingGroupData(true);
        const equipos = await axios.get(`${server}/api/grupos/${id}`);
        setDeviceListForGroup(equipos.data.equiposFiltrados);
        setCurrentGroupDevices(equipos.data.equiposAsociados);
        setLoadingGroupData(false);
    }
    const editarNombre = (e,data) => {
        setSelectedGroup(data);
        setNombreNuevo(data.descripcion);
        setModalEditarNombre(true);
    }
    const handleNombre = async () => {

        setSelectedGroup({});
    }
    const handleCloseNombre = () => {
        setSelectedGroup({});
        setModalEditarNombre(false);
    }
    const editarGrupo = (e,data) => {
        setLoadingGroupData(true);
        setSelectedGroup(data);
        filtrarDatos(data.id);
        setModalEditarGrupo(true);
    }
    const editarGrupoRow = (params) => {
        setLoadingGroupData(true);
        setSelectedGroup(params.row);
        filtrarDatos(params.row.grupo_id);
        setModalEditarGrupo(true);
    }
    const borrarGrupo = (e,data) => {
        setSelectedGroup(data);
        setModalBorrarGrupo(true);
    }
    const handleDeleteGroup = async () => {
        setLoading(true);
        await axios.delete(`${server}/api/grupos/${selectedGroup.grupo_id}`);
        await getGrupos();
        setModalBorrarGrupo(false);
        setLoading(false);
    }
    const agregarGrupo = () => {
        setModalAgregarGrupo(true);
    }
    const handleChangeNombreGrupo = (e) => {
        setNombreNuevo(e.target.value);
    }
    const confirmarCambioNombre = async () => {
        if(nombreNuevo==''){
            toast.error('Por favor, complete el campo del nombre');
            return;
        }
        try{
            await axios.put(`${server}/api/grupos`,{
                grupo_id: selectedGroup.grupo_id,
                nuevoNombre: nombreNuevo
            });
            setModalEditarNombre(false);
            await getGrupos();
            toast.success('Se ha cambiado el nombre del grupo correctamente');
        }catch(e){
            toast.error('No se pudo cambiar el nombre del grupo, contacte con el administrador del sistema');
        }
    }
    const handleAddGroup = async () => {
        try{
            const nuevoGrupo = {
                nombre: nombreNuevo,
            }
            await axios.post(server+'/api/grupos',nuevoGrupo);
            await getGrupos();
            closeAgregarGrupo();
        }catch(e){
            console.log('Hubo un error al agregar el nuevo grupo');
        }
    }
    const closeAgregarGrupo = () => {
        setModalAgregarGrupo(false);
    }
    const closeEditarGrupo = () => {
        setDeviceListForGroup([]);
        setSelectedGroup({});
        setModalEditarGrupo(false);
    }
    const closeBorrarGrupo = () => {
        setSelectedGroup({});
        setModalBorrarGrupo(false);
    }
    const borrarDispositivoSeleccionado = async (e,data) => {
        setLoadingGroupData(true);
        try{
            await axios.delete(`${server}/api/grupos/grupo_equipos/${data.grupo_equipo_id}`);
            await filtrarDatos(data.grupo_id);
        }catch(e){
        }
        setLoadingGroupData(false);
    }
    const gruposColumns = [
        {field: 'id', headerName: 'ID', width: 200},
        {field: 'descripcion', headerName: 'Nombre', width: 200},
        {field: 'cantidad_equipos',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Equipos asociados',sortable: false,width: 150,renderCell: (params)=>{
            return(
                <Chip sx={{width: '65px', fontWeight: 'bold'}} label={params.row.cantidad_equipos} clickable variant='outlined' color={params.row.cantidad_equipos === 0 ? 'warning' : 'primary'} icon={<AddIcon/>} onClick={(e)=>{editarGrupo(e,params.row)}}/>
            )
        }},
        {field: 'actions',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{
                        e.stopPropagation();
                        editarNombre(e,params.row)
                    }} color='success' aria-label='edit'>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{
                        e.stopPropagation();
                        borrarGrupo(e,params.row)
                    }} color='error' aria-label='delete'>
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const selectedDevicesColumns = [
        {field: 'id',headerName: 'ID'},
        {field: 'equipo', headerName: 'Descripción', width: 200},
        {field: 'delete',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Eliminar',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{borrarDispositivoSeleccionado(e,params.row)}} color='error' aria-label='delete'>
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const handleSelectDevice = async (e,newValue) => {
        setLoadingGroupData(true);
        try{
            await axios.post(server+'/api/grupos/grupo_equipos',{
                equipo_id: newValue.id,
                grupo_id: selectedGroup.grupo_id
            });
        }catch(e){
            console.log(e.message);
        }
        await filtrarDatos(selectedGroup.grupo_id);
        setInputValue(null);
        setLoadingGroupData(false);
    }
    // Get Data
    const getGrupos = async () => {
        setLoading(true);
        const grupos = await axios.get(server+'/api/grupos');
        setGrupos(grupos.data);
        setLoading(false);
    }
    useEffect(()=>{
        getGrupos();
    },[deviceListForGroup,currentGroupDevices]);
    return(
        <>
        <Toaster/>
            {/* Modal Añadir Grupo */}
            <Modal open={modalAgregarGrupo} onClose={closeAgregarGrupo} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={{...stylesModal,width: '25%'}}>
                    <h1 className='confirmation-text'>Añadir grupo</h1>
                    <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center' ,height: 'auto', marginBottom: 4}}>
                        <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                            <h4 style={{color: '#1282a2ff'}}>Por favor, escriba el nombre del grupo nuevo</h4>
                            <TextField onChange={handleChangeNombreGrupo} value={nombreNuevo} size='small' id='descripcion' label='Nombre' variant='outlined' type='text'/>
                        </Box>
                    </Box>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={handleAddGroup} color='success' variant='outlined'>Confirmar</Button>
                        <Button onClick={closeAgregarGrupo} color='error' variant='outlined'>Cancelar</Button>
                    </Stack>
                </Box>
            </Modal>
            
            {/* Modal Editar Grupo */}
            <Modal open={modalEditarGrupo} onClose={closeEditarGrupo} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={{...stylesModal,width: '45%'}}>
                    <h1 className='confirmation-text'>Equipos asociados al grupo: <span>{selectedGroup.nombre}</span></h1>
                    <Box>
                        <DataGrid
                        disableRowSelectionOnClick={true}
                            loading={loadingGroupData}
                            rows={currentGroupDevices}
                            columns={selectedDevicesColumns}
                            sx={{height: '350px'}}
                            autoPageSize
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        />
                    </Box>
                    <Autocomplete
                        onChange={handleSelectDevice}
                        size='small'
                        disabled={loadingGroupData}
                        disablePortal
                        clearOnBlur={true}
                        clearOnEscape={true}
                        id='combo-box-demo'
                        options={deviceListForGroup}
                        sx={{ width: 300,marginTop: '80px' }}
                        renderInput={(params) => <TextField {...params} label='Agregar dispositivo' />}
                    />
                </Box>
            </Modal>
            <Modal open={modalEditarNombre} onClose={handleCloseNombre} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={{...stylesModal,width: '25%'}}>
                    <h1 className='confirmation-text'>Editar el nombre del grupo: <span>{selectedGroup.descripcion}</span></h1>
                    <Box sx={{display: 'flex',flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center' ,height: 'auto', marginBottom: 4}}>
                        <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                            <TextField onChange={handleChangeNombreGrupo} value={nombreNuevo} size='small' id='descripcion' label='Nombre' variant='outlined' type='text'/>
                        </Box>
                    </Box>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={confirmarCambioNombre} color='success' variant='outlined'>Confirmar</Button>
                        <Button onClick={handleCloseNombre} color='error' variant='outlined'>Cancelar</Button>
                    </Stack>
                </Box>
            </Modal>
            {/* Modal Borrar Grupo */}
            <Modal open={modalBorrarGrupo} onClose={closeBorrarGrupo} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={{...stylesModal,width: '25%'}}>
                    <h1 className='confirmation-text'>¿Confirma que desea borrar el grupo <span>{selectedGroup?.descripcion}</span>?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={handleDeleteGroup} color='success' variant='outlined'>Confirmar</Button>
                        <Button onClick={closeBorrarGrupo} color='error' variant='outlined'>Cancelar</Button>
                    </Stack>
                </Box>
            </Modal>
            <div className='content-header'>
                <SpeakerGroupIcon fontSize='large'/>
                <h3>Grupos de dispositivos</h3>
            </div>
                <DataGrid
                onRowClick={editarGrupoRow}
                disableRowSelectionOnClick={true}
                    sx={{height: '80%'}}
                    loading={loading}
                    rows={grupos}
                    columns={gruposColumns}
                    autoPageSize
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                />
            <Button sx={{marginTop: '20px'}} onClick={agregarGrupo} variant='outlined' startIcon={<AddIcon/>}>Añadir grupo</Button>
        </>
    )
}

export default Grupos;