/* Normal imports */
import React, { useEffect, useState } from 'react';
import loadingFinger from '../../../../../img/loadingFinger.gif';
import toast, {Toaster} from 'react-hot-toast';
import { stylesModal } from '../../../../../styles/customStyles';
import { server } from '../../../../../helpers/constants';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import axios from 'axios';

/* Material UI */
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
import Switch from '@mui/material/Switch';

const IdentificacionesTab = ({userData}) => {
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
    const dedos = [
        {id: 1, label: 'IZQUIERDA - MEÑIQUE'},
        {id: 2, label: 'IZQUIERDA - ANULAR'},
        {id: 3, label: 'IZQUIERDA - MEDIO'},
        {id: 4, label: 'IZQUIERDA - INDICE'},
        {id: 5, label: 'IZQUIERDA - PULGAR'},
        {id: 6, label: 'DERECHA - PULGAR'},
        {id: 7, label: 'DERECHA - INDICE'},
        {id: 8, label: 'DERECHA - MEDIO'},
        {id: 9, label: 'DERECHA - ANULAR'},
        {id: 10, label: 'DERECHA - MEÑIQUE'},
    ]
    const [loading,setLoading] = useState(false);
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [openEditar,setOpenEditar] = useState(false);
    const [selectedRow,setSelectedRow] = useState({});
    const [selectedRoller,setSelectedRoller] = useState('');
    const [openBorrar,setOpenBorrar] = useState(false);
    const [scanningFinger,setScanningFinger] = useState(false);
    const [dispositivos,setDispositivos] = useState([]);
    const [selectedDedo,setSelectedDedo] = useState(dedos[1].label);
    const [tarjetas,setTarjetas] = useState([]);
    const [nuevaTarjeta,setNuevaTarjeta] = useState({});
    const [modalTarjeta,setOpenModalTarjeta] = useState(false);
    const [huellas,setHuellas] = useState([]);
    const setNewRoller = (e) => {
        setSelectedRoller(e.target.value);
    }
    const addHuella = () => {
        setOpenModalAdd(true);
    }
    const handleCloseEditar = () => {
        setSelectedRoller('');
        setSelectedRow({});
        setOpenEditar(false);
    }
    const handleCloseAdd = () => {
        if(!scanningFinger){
            setSelectedRoller('');
            setSelectedRow({});
            setOpenModalAdd(false);
        }else{
            toast.error('Por favor, aguarde a que finalice el proceso de enrolamiento');
        }
    }
    const handleCloseBorrar = () =>{
        setSelectedRoller('');
        setSelectedRow({});
        setOpenBorrar(false);
    }
    const borrarHuella = (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenBorrar(true);
    }
    const editarHuella = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenEditar(true);
    }
    const getHuellas = async (id) => {
        try{
            setLoading(true);
            const huellas = await axios.get(`${server}/api/huellas/${id}`);
            setHuellas(huellas.data);
            setLoading(false);
        }catch(e){
            setLoading(false);
            toast.error('Hubo un error al buscar las huellas del usuario en la base de datos');
        }
    }
    const getTarjetas = async (id) => {
        setLoading(true);
        const tarjetas = await axios.get(`${server}/api/dispositivos/tarjetas/${id}`);
        setTarjetas(tarjetas.data);
        setLoading(false);
    }
    const handleChangeNumberCard = (e) => {
        setNuevaTarjeta({
            ...nuevaTarjeta,
            numero: e.target.value
        });
    }
    const handleChangeFromDate = (e) => {
        setNuevaTarjeta({
            ...nuevaTarjeta,
            fromDate: e.$d
        })
    }
    const handleChangeToDate = (e) => {
        setNuevaTarjeta({
            ...nuevaTarjeta,
            toDate: e.$d
        })
    }
    const handleChangeDedo = (e) => {
        setSelectedDedo(e.target.value);
    }
    const formatDate = (date) => {
        if(date){
            const formated = dayjs(date).format('DD-MM-YYYY HH:mm:ss');
            return formated;
        }else{
            return null;
        }
    }
    const confirmarNuevaTarjeta = async () => {
        setLoading(true);
        const dataTarjeta = {
            ...nuevaTarjeta,
            fromDate: formatDate(nuevaTarjeta.fromDate),
            toDate: formatDate(nuevaTarjeta.toDate),
            empleado_id: userData.empleado_id
        }
        try{
            await axios.post(`${server}/api/dispositivos/tarjetas`,dataTarjeta);
            await getTarjetas(userData.empleado_id);
            setNuevaTarjeta({});
            setLoading(false)
            setOpenModalTarjeta(false);
            toast.success('Se ha agregado la tarjeta correctamente');
        }catch(e){
            toast.error(`No se pudo agregar la tarjeta: \n${e.message}`);
            setLoading(false);
        }
    }
    const startScan = async () => {
        if(selectedRoller!==''){
            setScanningFinger(true);
            try{
                const response = await axios.post(`${server}/api/huellas`,{
                    user_id: userData.empleado_id,
                    equipo_id: selectedRoller,
                    dedo_id: selectedDedo
                });
                toast.success('Se ha enrolado la huella correctamente!');
                await getHuellas(userData.empleado_id);
                setScanningFinger(false);
                handleCloseAdd();
            }catch(e){
                toast.error(`Hubo un error al enrolar la huella. Por favor contacte al administrador del sistema: \n${e.message}`);
                setScanningFinger(false);
                handleCloseAdd();
            }
        }else{
            toast.error('Por favor seleccione un enrolador');
            return;
        }
    }
    const gridColumns = [
        {field: 'descripcion', headerName: 'Descripción', width: 300},
        {field: 'actions',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{editarHuella(e,params.row)}} color='success' aria-label='edit'>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarHuella(e,params.row)}} color='error' aria-label='delete'>
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const tarjetasColumns = [
        {field: 'id', headerName: 'ID', width:150},
        {field: 'display', headerName: 'Número', width: 200},
        {field: 'actions',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Habilitada',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked={true}/>}/>
                </Stack>
            )
        }},
    ]
    const getDevices = async () => {
        setLoading(true);
        const devices = await axios.get(server+'/api/dispositivos');
        const parsed = devices.data.map((device)=>{
            return {
                ...device,
                id: device.equipo_id,
                label: device.descripcion
            }
        })
        setDispositivos(parsed);
        setLoading(false);
    }
    const handleCloseModalTarjeta = () => {
        setOpenModalTarjeta(false);
    }
    const handleChangeObservacionesTarjeta = (e) => {
        setNuevaTarjeta({
            ...nuevaTarjeta,
            observaciones: e.target.value
        })
    }
    const addTarjeta = () => {
        setNuevaTarjeta({
            ...nuevaTarjeta,
            fromDate: dayjs()
        })
        setOpenModalTarjeta(true);
    }
    const confirmarBorradoHuella = async () => {
        setLoading(true);
        try{
            await axios.delete(`${server}/api/huellas/${selectedRow.id}`);
            await getHuellas(userData.empleado_id);
            toast.success('Se ha borrado con éxito la huella seleccionada');
            handleCloseBorrar();
            setLoading(false);
        }catch(e){
            toast.error('Hubo un error al borrar la huella');
            handleCloseBorrar();
            setLoading(false);
        }
    }
    useEffect(()=>{
        getDevices();
        getHuellas(userData.empleado_id);
        getTarjetas(userData.id);
    },[userData]);
    return(
        <div className='accesos-container'>
            <Toaster/>
            {/* Borrar huella */}
            <Modal open={openBorrar} onClose={handleCloseBorrar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>¿Confirma que desea borrar la huella?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={confirmarBorradoHuella} color='success' variant='outlined'>Si</Button>
                        <Button onClick={handleCloseBorrar} color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>
            {/* Añadir editar huella */}
            <Modal open={openEditar} onClose={handleCloseEditar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                        <div className='content-header'>
                            <h3>Modificar huella</h3>
                            <p>Por favor, coloque la huella en el lector y pulse 'Iniciar escaneo'</p>
                        </div>
                        <div className='loading-finger'>
                            <img src={loadingFinger} alt='loadingFinger'/>
                        </div>
                    </Box>
                    <TextField onChange={setNewRoller} sx={{width: '60%',marginBottom: '20px'}} id='select-enrolador' select label='Enrolador'>
                        {
                            dispositivos.map((dispositivo)=><MenuItem key={dispositivo.equipo_id} value={dispositivo.equipo_id}>{dispositivo.descripcion}</MenuItem>)
                        }
                    </TextField>
                    <LoadingButton disabled={selectedRoller !== '' ? false : true} color='primary' onClick={startScan} loading={scanningFinger} loadingPosition='center' variant='outlined'>
                        <span>Escanear huella</span>
                    </LoadingButton>
                </Box>
            </Modal>
            {/* Añadir huella */}
            <Modal open={openModalAdd} onClose={handleCloseAdd} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                        <div className='content-header'>
                            <h3>Añadir una nueva huella</h3>
                            <p>Por favor, coloque la huella en el lector y pulse 'Iniciar escaneo'</p>
                        </div>
                        <div className='loading-finger'>
                            <img src={loadingFinger} alt='loadingFinger'/>
                        </div>
                    </Box>
                    <TextField onChange={setNewRoller} sx={{width: '60%',marginBottom: '20px'}} id='select-enrolador' select label='Enrolador'>
                    {
                        dispositivos.map((dispositivo)=><MenuItem key={dispositivo.equipo_id} value={dispositivo.equipo_id}>{dispositivo.descripcion}</MenuItem>)
                    }
                    </TextField>
                    <TextField defaultValue={dedos[1].id} onChange={handleChangeDedo} sx={{width: '60%',marginBottom: '20px'}} id='select-dedo' select label='Dedo'>
                    {
                        dedos.map((dedo)=><MenuItem key={dedo.id} value={dedo.id}>{dedo.label}</MenuItem>)
                    }
                    </TextField>
                    <LoadingButton color='primary' onClick={startScan} loading={scanningFinger} loadingPosition='center' variant='outlined'>
                        <span>Escanear huella</span>
                    </LoadingButton>
                </Box>
            </Modal>
            {/* Añadir tarjeta */}
            <Modal open={modalTarjeta} onClose={handleCloseModalTarjeta} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                        <div className='content-header'>
                            <h3>Añadir una nueva tarjeta</h3>
                        </div>
                    </Box>
                    <Box sx={{marginBottom: '20px'}}>
                        <TextField type='number' size='small' onChange={handleChangeNumberCard} label='Numero de tarjeta'/>
                    </Box>
                    <Box sx={{marginBottom: '15px'}}>
                        <h4 className='info-title'>Valido desde: </h4>
                        <DesktopDateTimePicker format='DD-MM-YYYY HH:mm' value={dayjs(nuevaTarjeta.fromDate) || null} label='Fecha desde' onChange={handleChangeFromDate} sx={{marginBottom: '15px'}} />
                    </Box>
                    <Box sx={{marginBottom: '25px'}}>
                        <h4 className='info-title'>Valido hasta: </h4>
                        <DesktopDateTimePicker format='DD-MM-YYYY HH:mm' value={dayjs(nuevaTarjeta.toDate) || null} label='Fecha hasta' onChange={handleChangeToDate} sx={{marginBottom: '15px'}} />
                    </Box>
                    <Box sx={{marginBottom: '25px'}}>
                        <TextField value={nuevaTarjeta.observaciones || ''} type='text' onChange={handleChangeObservacionesTarjeta} label='Observaciones'/>
                    </Box>
                    <Stack sx={{marginTop: '20px'}} direction='row' spacing={4}>
                        <LoadingButton color='success' onClick={confirmarNuevaTarjeta} loading={loading} loadingPosition='center' variant='outlined'>
                            <span>Confirmar</span>
                        </LoadingButton>
                        <Button color='error' onClick={handleCloseModalTarjeta} variant='outlined'>
                            <span>Cancelar</span>
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <div className='huellas'>
                <h4>Huellas digitales</h4>
                <Box sx={{width:'500px',margin:'0 0 10px 0', height: '400px'}}>
                    <DataGrid
                        disableRowSelectionOnClick={true}
                        sx={{margin: '0', height: '80%'}}
                        loading={loading}
                        rows={huellas}
                        columns={gridColumns}
                        autoPageSize
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    />
                    <Box sx={{marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'row', alignItems:'center',justifyContent:'space-between'}}>
                        <Button onClick={addHuella} variant='outlined' startIcon={<AddIcon/>}>Añadir huella</Button>
                    </Box>
                </Box>
            </div>
            <div className='tarjetas'>
                <h4>Tarjetas</h4>
                <Box sx={{width:'490px',margin:'0 0 10px 0', height: '400px'}}>
                    <DataGrid
                        disableRowSelectionOnClick={true}
                        sx={{margin: '0', height: '80%'}}
                        loading={loading}
                        rows={tarjetas}
                        columns={tarjetasColumns}
                        autoPageSize
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    />
                    <Box sx={{marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'row', alignItems:'center',justifyContent:'space-between'}}>
                        <Button onClick={addTarjeta} variant='outlined' startIcon={<AddIcon/>}>Añadir tarjeta</Button>
                    </Box>
                </Box>
            </div>
        </div>
    )
}

export default IdentificacionesTab;