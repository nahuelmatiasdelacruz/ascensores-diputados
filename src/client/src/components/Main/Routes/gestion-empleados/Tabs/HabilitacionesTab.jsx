/* Normal imports */
import React, { useEffect, useState } from 'react';
import loadingFinger from '../../../../../img/loadingFinger.gif';
import toast, {Toaster} from 'react-hot-toast';
import { stylesModal } from '../../../../../styles/customStyles';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { server } from '../../../../../helpers/constants';
import axios from 'axios';
import NoProfile from '../../../../../img/no-profile.jpg';

/* Material UI */
import Box from '@mui/material/Box';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ClearIcon from '@mui/icons-material/Clear';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import Autocomplete from '@mui/material/Autocomplete';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SyncIcon from '@mui/icons-material/Sync';
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

const HabilitacionesTab = ({updateData,userData}) => {
    const [loading,setLoading] = useState(false);
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [openEditar,setOpenEditar] = useState(false);
    const [habilitaciones,sethabilitaciones] = useState(false);
    const [openBorrar,setOpenBorrar] = useState(false);
    const [tiposHabilitacion,setTiposHabilitacion] = useState([]);
    const [habilitacionSelected,setHabilitacionSelected] = useState({});
    const [sectores,setSectores] = useState([]);
    const [periodos,setPeriodos] = useState([]);
    const [nuevaHabilitacion,setNuevaHabilitacion] = useState({turno_noche: false});
    const setColor = (state) => {
        switch(state){
            case 'ACTIVO':
                return 'success'
            case 'PRECARGA':
                return 'warning'
            case 'HISTÓRICO':
                return 'primary'
            case 'INACTIVO':
                return 'error'
            default:
                return 'primary'
        }
    }
    const gridColumns = [
        {field: 'habilitacion_id', headerName: 'ID', width: 80},
        {field: 'habilitacion_tipo', headerName: 'Tipo', width: 210},
        {field: 'sector', headerName: 'Sector', width: 180},
        {field: 'periodo_legislativo', headerName: 'Periodo legislativo', width: 200},
        {field: 'fecha_desde', headerName: 'Desde', width: 140, valueGetter: (params)=>{
            if(params.row.fecha_desde){
                return dayjs(params.row.fecha_desde).format('DD-MM-YYYY HH:mm');
            }else{
                return '';
            }
        }},
        {field: 'fecha_hasta', headerName: 'Hasta', width: 140, valueGetter: (params)=>{
            if(params.row.fecha_hasta){
                return dayjs(params.row.fecha_hasta).format('DD-MM-YYYY HH:mm');
            }else{
                return '';
            }
        }},
        {field: 'turno_noche',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Turno noche', width: 110,
            renderCell: (params)=>{
                return(
                    <>
                        {
                            params.row.turno_noche ? 
                            <Chip color='primary' icon={<DarkModeIcon/>} label='Si'/>
                            :
                            <Chip color='warning' icon={<WbSunnyIcon/>} label='No'/>
                        }
                    </>
                )
            }
        },
        {field: 'observaciones', headerName: 'Observaciones', width: 200},
        {field: 'estado',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Estado', width: 100,
            renderCell: (params)=>{
                return(
                    <>
                        <Chip size='small' label={params.row.estado} color={setColor(params.row.estado)}/>
                    </>
                )
            }
        },
        {field: 'actions',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{editarHabilitacion(e,params.row)}} color='success' aria-label='edit'>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarHabilitacion(e,params.row)}} color='secondary' aria-label='delete'>
                        <UnpublishedIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const editarHabilitacion = (e,data)=>{
        setNuevaHabilitacion({
            habilitacion_id: data.habilitacion_id,
            tipo: {
                id: data.habilitacion_tipo_id,
                label: data.habilitacion_tipo
            },
            fechaDesde: formatDateToEdit(data.fecha_desde),
            fechaHasta: formatDateToEdit(data.fecha_hasta),
            sector: {
                id: data.sector_id || '',
                label: data.sector || ''
            },
            turno_noche: data.turno_noche,
            periodo_legislativo: data.periodo_legislativo_id,
            observaciones: data.observaciones || ''
        });
        setOpenEditar(true);
    }
    const formatDateToEdit = (date) => {
        if(date){
            return dayjs(date);
        }else{
            return null;
        }
    }
    const borrarHabilitacion = (e,data)=>{
        if(data.estado === 'INACTIVO'){
            return toast.error('La habilitación seleccionada ya se encuentra inactiva')
        }
        setHabilitacionSelected(data);
        setOpenBorrar(true);
    }
    const handleConfirmarBorrado = async () => {
        setLoading(true);
        try{
            await axios.delete(`${server}/api/habilitaciones/${habilitacionSelected.habilitacion_id}`);
            await getHabilitaciones();
            await updateData();
            handleCloseBorrar();
            setLoading(false);
        }catch(e){
            toast.error(`Hubo un error al borrar la habilitación: \n${e.message}`);
            setLoading(false);
        }
    }
    const handleChangeDesde = (e) => {
        setNuevaHabilitacion({
            ...nuevaHabilitacion,
            fechaDesde: e.$d
        });
    }
    const handleChangeHasta = (e) => {
        setNuevaHabilitacion({
            ...nuevaHabilitacion,
            fechaHasta: e.$d
        });
    }
    const handleClearHasta = () => {
        setNuevaHabilitacion({
            ...nuevaHabilitacion,
            fechaHasta: null
        })
    }
    const handleChangeObservaciones = (e) => {
        setNuevaHabilitacion({
            ...nuevaHabilitacion,
            observaciones: e.target.value
        });
    }
    const handleSelectSector = (e,newValue) => {
        setNuevaHabilitacion({
            ...nuevaHabilitacion,
            sector: newValue
        });
    }
    const handleChangeNocturno = () => {
        setNuevaHabilitacion({
            ...nuevaHabilitacion,
            turno_noche: !nuevaHabilitacion.turno_noche
        })
    }
    const handleSelectTipo = (e,newValue) => {
        setNuevaHabilitacion({
            ...nuevaHabilitacion,
            tipo: newValue
        });
    }
    const getSectores = async () => {
        const result = await axios.get(`${server}/api/empleados/sectores`);
        setSectores(result.data);
    }
    const verDocumentacion = () => {

    }
    const borrarDocumentacion = () => {

    }
    const handleCloseAdd = () => {
        setOpenModalAdd(false);
    }
    const handleCloseEditar = () => {
        setNuevaHabilitacion({turno_noche: false});
        setOpenEditar(false);
    }
    const handleCloseBorrar = () => {
        setHabilitacionSelected({});
        setOpenBorrar(false);
    }
    const agregarHabilitacion = () => {
        setOpenModalAdd(true);
    }
    const confirmarNuevaHabilitacion = async () => {
        setLoading(true);
        if(nuevaHabilitacion.fechaDesde && nuevaHabilitacion.tipo && nuevaHabilitacion.sector){
            try{
                await axios.post(`${server}/api/habilitaciones`,{
                    ...nuevaHabilitacion,
                    empleado_id: userData.empleado_id,
                    fechaDesde: nuevaHabilitacion.fechaDesde,
                    fechaHasta: nuevaHabilitacion.fechaHasta
                });
                await getHabilitaciones();
                await updateData();
                setLoading(false);
                setNuevaHabilitacion({turno_noche: false});
                setOpenModalAdd(false);
            }catch(e){
                console.log(e);
                toast.error(`Hubo un error al agregar la habilitación: ${e.response.data.msg}`);
                setLoading(false);
            }
        }else{
            toast.error('Por favor, complete los campos: \nTipo de habilitación \nFecha de inicio \nSector');
            setLoading(false);
            return;
        }
    }
    const confirmarEdicionHabilitacion = async () => {
        setLoading(true);
        if(nuevaHabilitacion.fechaDesde && nuevaHabilitacion.tipo && nuevaHabilitacion.sector){
            try{
                const nuevosDatos = {
                    ...nuevaHabilitacion,
                    habilitacion_id: nuevaHabilitacion.habilitacion_id,
                    fechaDesde: nuevaHabilitacion.fechaDesde,
                    fechaHasta: nuevaHabilitacion.fechaHasta
                }
                await axios.put(`${server}/api/habilitaciones`,nuevosDatos);
            }catch(e){
                toast.error(`Hubo un error al actualizar la habilitación: \n${e.message}`);
                setLoading(false);
                return;
            }
        }else{
            toast.error('No puede dejar en blanco los campos: \nTipo\nFecha de inicio\nSector');
            setLoading(false);
            return;
        }
        await getHabilitaciones();
        await updateData();
        setLoading(false);
        setNuevaHabilitacion({turno_noche: false});
        handleCloseEditar();
    }
    const getHabilitaciones = async () => {
        setLoading(true);
        const data = await axios.get(`${server}/api/habilitaciones/${userData.empleado_id}`);
        sethabilitaciones(data.data);
        setLoading(false);
    }
    const getTiposHabilitaciones = async () => {
        try{
            const result = await axios.get(`${server}/api/empleados/tipos`);
            setTiposHabilitacion(result.data);
        }catch(e){
            toast.error(`Hubo un error al buscar los tipos de habilitaciones en la base de datos: \n${e.message}`);
            setTiposHabilitacion([]);
        }
    }
    const getPeriodos = async () => {
        try{
            const response = await axios.get(`${server}/api/configuracion/periodos`);
            setPeriodos(response.data);
        }catch(e){
            toast.error('Error al buscar los periodos');
        }
    }
    const handleChangePeriodo = (e) => {
        setNuevaHabilitacion({
            ...nuevaHabilitacion,
            periodo_legislativo: e.target.value
        })
    }
    useEffect(()=>{
        getTiposHabilitaciones();
        getHabilitaciones();
        getSectores();
        getPeriodos();
    },[]);
    return(
        <div className='accesos-container'>
            <Toaster/>
            {/* Borrar habilitación */}
            <Modal open={openBorrar} onClose={handleCloseBorrar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>¿Confirma que desea <span className='warn'>desactivar</span> la habilitación seleccionada?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={handleConfirmarBorrado} color='success' variant='outlined'>Si</Button>
                        <Button onClick={handleCloseBorrar} color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>
            {/* Editar habilitacion */}
            <Modal open={openEditar} onClose={handleCloseEditar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={{...stylesModal, width: '40%'}}>
                    <h4 className='info-title'>Editar habilitación</h4>
                    <FormControlLabel sx={{marginTop: 5, marginBottom: 5}} control={<Switch onChange={handleChangeNocturno} value={nuevaHabilitacion.turno_noche}/>} label='Turno noche / Feriados' />
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                        <Autocomplete
                            value={nuevaHabilitacion.tipo}
                            onChange={handleSelectTipo}
                            size='small'
                            disablePortal
                            clearOnBlur={true}
                            clearOnEscape={true}
                            id='combo-box'
                            options={tiposHabilitacion}
                            sx={{width: '250px'}}
                            renderInput={(params)=><TextField {...params} label='Tipo'/>}
                            />
                        <DesktopDateTimePicker format='DD-MM-YYYY HH:mm' value={nuevaHabilitacion.fechaDesde} slotProps={{textField: {size: 'small'}}} label='Fecha de inicio' onChange={handleChangeDesde} sx={{width:200, marginBottom: '15px'}}/>
                        <Box>
                            <DesktopDateTimePicker format='DD-MM-YYYY HH:mm' value={nuevaHabilitacion.fechaHasta} slotProps={{textField: {size: 'small'}}} label='Fecha de finalización' onChange={handleChangeHasta} sx={{width:200, marginBottom: '15px'}}/>
                            <IconButton onClick={handleClearHasta}>
                                <ClearIcon color='error'/>
                            </IconButton>
                        </Box>
                    </div>
                    <div style={{width: '100%', marginTop: 20}}>
                        <TextField value={nuevaHabilitacion?.periodo} sx={{width: '80%'}} InputLabelProps={{ shrink: true }} onChange={handleChangePeriodo} size='small' id='periodo' select label='Periodo legislativo'>
                            {
                                periodos.map((periodo)=>{
                                    return <MenuItem key={periodo.id} value={periodo.id}>{periodo.descripcion}</MenuItem>
                                })
                            }
                        </TextField>
                    </div>
                    <div style={{width: '100%', marginTop: 20}}>
                        <Autocomplete
                            value={nuevaHabilitacion.sector}
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
                    <div style={{display: 'flex', width: '100%', marginTop: 20}}>
                        <TextField value={nuevaHabilitacion.observaciones} sx={{width: '80%'}} size='small' label='Observaciones' onChange={handleChangeObservaciones}/>
                    </div>
                    <Box sx={{marginTop: '60px', width: '100%', display: 'flex', flexDirection: 'row', alignItems:'center',justifyContent:'space-evenly'}}>
                        <Button onClick={confirmarEdicionHabilitacion} color='success' variant='outlined'>Confirmar</Button>
                        <Button onClick={handleCloseEditar} color='error' variant='outlined'>Cancelar</Button>
                    </Box>
                </Box>
            </Modal>
            {/* Añadir habilitacion */}
            <Modal open={openModalAdd} onClose={handleCloseAdd} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={{...stylesModal,width: '35%'}}>
                    <h4 className='info-title'>Agregar habilitación nueva</h4>
                    <FormControlLabel sx={{marginTop: 1, marginBottom: 3}} control={<Switch onChange={handleChangeNocturno} value={nuevaHabilitacion.turno_noche}/>} label='Turno noche / Feriados' />
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                        <Autocomplete
                            onChange={handleSelectTipo}
                            size='small'
                            disablePortal
                            clearOnBlur={true}
                            clearOnEscape={true}
                            id='combo-box'
                            options={tiposHabilitacion}
                            sx={{width: '250px'}}
                            renderInput={(params)=><TextField {...params} label='Tipo'/>}
                            />
                        <DatePicker format='DD-MM-YYYY' slotProps={{textField: {size: 'small'}}} label='Fecha de inicio' onChange={handleChangeDesde} sx={{width:200, marginBottom: '15px'}}/>
                        <DatePicker format='DD-MM-YYYY' slotProps={{textField: {size: 'small'}}} label='Fecha de finalización' onChange={handleChangeHasta} sx={{width:200, marginBottom: '15px'}}/>
                    </div>
                    <div style={{width: '100%', marginTop: 20}}>
                        <Autocomplete
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
                    <div style={{width: '100%', marginTop: 20}}>
                        <TextField sx={{width: '80%'}} InputLabelProps={{ shrink: true }} onChange={handleChangePeriodo} size='small' id='periodo' select label='Periodo legislativo' defaultValue={1}>
                            {
                                periodos.map((periodo)=>{
                                    return <MenuItem key={periodo.id} value={periodo.id}>{periodo.descripcion}</MenuItem>
                                })
                            }
                        </TextField>
                    </div>
                    <div style={{display: 'flex', width: '100%', marginTop: 20}}>
                        <TextField sx={{width: '80%'}} size='small' label='Observaciones' onChange={handleChangeObservaciones}/>
                    </div>
                    <Box sx={{marginTop: '60px', width: '100%', display: 'flex', flexDirection: 'row', alignItems:'center',justifyContent:'space-evenly'}}>
                        <Button onClick={confirmarNuevaHabilitacion} color='success' variant='outlined'>Confirmar</Button>
                        <Button onClick={handleCloseAdd} color='error' variant='outlined'>Cancelar</Button>
                    </Box>
                </Box>
            </Modal>
            <Box sx={{width:'100%',margin:'0 0 10px 0', height: '400px'}}>
                    <DataGrid
                        disableRowSelectionOnClick={true}
                        sx={{height: '90%'}}
                        loading={loading}
                        rows={habilitaciones}
                        columns={gridColumns}
                        autoPageSize
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    />
                    <Box sx={{marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'row', alignItems:'center',justifyContent:'space-between'}}>
                        <Button onClick={agregarHabilitacion} variant='outlined' startIcon={<AddIcon/>}>Agregar Habilitacion</Button>
                    </Box>
                </Box>
        </div>
    )
}

export default HabilitacionesTab;