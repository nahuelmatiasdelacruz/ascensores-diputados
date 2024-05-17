import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import Modal from '@mui/material/Modal';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import loadingFinger from '../../../../../img/loadingFinger.gif';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import toast, {Toaster} from 'react-hot-toast';
import { stylesModal } from '../../../../../styles/customStyles';

export const AscensoresTab = () => {
    const [selected,setSelectedRow] = useState({});
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [selectedRoller,setSelectedRoller] = useState('');
    const [loading,setLoading] = useState(false);
    const [scanningFinger,setScanningFinger] = useState(false);
    const [openEditar,setOpenEditar] = useState(false);
    const [openBorrar,setOpenBorrar] = useState(false);
    const [huellas,setHuellas] = useState([
        {
            id: 1,
            descripcion: 'Descripcion de huella',
        },
        {
            id: 2,
            descripcion: 'Otra descripcion de ejemplo de huella',
        },
        {
            id: 3,
            descripcion: 'Algo diferente',
        },
        {
            id: 4,
            descripcion: 'Mas ejemplos',
        },
    ]);
    const addHuella = () => {
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
    const borrarHuella = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenBorrar(true);
    }
    const editarHuella = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenEditar(true);
    }
    const startScan = () => {
        if(selectedRoller!==''){
            setScanningFinger(true);
            setTimeout(()=>{
                setScanningFinger(false);
                setOpenEditar(false);
                toast.success('Se ha escaneado la huella con éxito!');
            },2000)    
        }else{
            toast.error('Por favor seleccione un enrolador');
            return;
        }
    }
    const setNewRoller = (e) => {
        setSelectedRoller(e.target.value);
        console.log(e.target.value);
    }
    const gridColumns = [
        {field: 'id', headerName: 'ID', width: 100},
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
    useEffect(()=>{

    },[])
    return(
        <>  <Toaster/>
            <Modal open={openBorrar} onClose={handleCloseBorrar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>¿Confirma que desea borrar la huella?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button color='success' variant='outlined'>Si</Button>
                        <Button color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>
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
                    
                    <LoadingButton disabled={selectedRoller} color='primary' onClick={startScan} loading={scanningFinger} loadingPosition='center' variant='outlined'>
                        <span>Escanear huella</span>
                    </LoadingButton>
                </Box>
            </Modal>
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
                        <MenuItem key='enrolador1' value='enrolador1'>Oficina gerente</MenuItem>
                        <MenuItem key='enrolador2' value='enrolador2'>Oficina director</MenuItem>
                        <MenuItem key='enrolador3' value='enrolador3'>Acceso primer piso</MenuItem>
                        <MenuItem key='enrolador4' value='enrolador4'>Acceso monitoreo</MenuItem>
                        <MenuItem key='enrolador5' value='enrolador5'>Acceso comedor</MenuItem>
                        <MenuItem key='enrolador6' value='enrolador6'>Acceso salida</MenuItem>
                    </TextField>
                    <LoadingButton color='primary' onClick={startScan} loading={scanningFinger} loadingPosition='center' variant='outlined'>
                        <span>Escanear huella</span>
                    </LoadingButton>
                </Box>
            </Modal>
            <Box sx={{width:'40%',margin: '0 auto'}}>
                <DataGrid
                    disableRowSelectionOnClick={true}
                    sx={{height: '300px'}}
                    loading={loading}
                    rows={huellas}
                    columns={gridColumns}
                    autoPageSize
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                />
                <Button sx={{marginTop: '20px'}} onClick={addHuella} variant='outlined' startIcon={<AddIcon/>}>Añadir huella</Button>
            </Box>
        </>
    )
};