import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import toast, {Toaster} from 'react-hot-toast';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { stylesModal } from '../../../../../styles/customStyles';

const HabilitacionesTab = () => {
    const [openDelete,setOpenDelete] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [selected,setSelected] = useState({});
    const [loading,setLoading] = useState(false);
    const [loadingHabilitacion,setLoadingHabilitacion] = useState(false);
    const [habilitaciones,setHabilitaciones] = useState([
        {
            id: 1,
            tipoHabilitacion: 'Periodista',
            empresaOrganismo: 'CANAL 13',
            fyhDesde: '11-05-2023 15:30',
            fyhHasta: '15-10-2023 15:30',
            estado: 'Activo'
        },
        {
            id: 2,
            tipoHabilitacion: 'Proveedor',
            empresaOrganismo: 'Coca Cola',
            fyhDesde: '11-05-2023 15:30',
            fyhHasta: '15-10-2023 15:30',
            estado: 'Inactivo'
        },
        {
            id: 3,
            tipoHabilitacion: 'Empresa tercerizada',
            empresaOrganismo: 'Coto S.A',
            fyhDesde: '11-05-2023 15:30',
            fyhHasta: '15-10-2023 15:30',
            estado: 'Inactivo'
        }
    ]);
    const handleClose = ()=>{
        setOpenDelete(false);
    }
    const handleCloseAdd = ()=>{
        setOpenAdd(false);
    }
    const addHabilitacion = ()=>{
        setOpenAdd(true);
    }
    const handleAddHabilitacion = async ()=>{
        setLoadingHabilitacion(true);
        setTimeout(()=>{
            setLoadingHabilitacion(false);
            setOpenAdd(false);
            toast.success('Se ha agregado la habilitación');
        },2000);
    }
    const handleDeleteHabilitacion = (e,data) => {
        e.stopPropagation();
        setSelected(data);
        setOpenDelete(true);
    }
    const gridColumns = [
        {field: 'tipoHabilitacion', headerName: 'Tipo de habilitación', width: 200},
        {field: 'empresaOrganismo', headerName: 'Empresa / Organismo', width: 200},
        {field: 'fyhDesde',headerName: 'Fecha y Hora: Desde', width: 250},
        {field: 'fyhHasta', headerName: 'Fecha y Hora: Hasta', width: 250},
        {field: 'estado',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,trueheaderName: 'Estado', width: 250,
            renderCell: (params)=>{
                return(
                    <Chip label={params.row.estado} color={params.row.estado==='Activo' ? 'success' : 'error'}/>
                )
            }
        },
        {field: 'actions',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Borrar',sortable: false,width: 80,renderCell: (params)=>{
            return(
                <IconButton color='error' aria-label='delete' onClick={(e)=>{handleDeleteHabilitacion(e,params.row)}}>
                    <DeleteIcon/>
                </IconButton>
            )
        }},
    ]
    return(
        <div className='habilitaciones'>
            <Toaster/>
            <Modal open={openDelete} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>¿Confirma que desea borrar la habilitación?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button color='success' variant='outlined'>Si</Button>
                        <Button color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <div>
                        <h4>Añadir habilitación</h4>
                        <div className='add-field-habilitacion'>
                            <TextField id='tipohabilitacion' select label='Tipo de habilitación' defaultValue='proveedor'>
                                <MenuItem key='proveedor' value='proveedor'>Proveedor</MenuItem>
                                <MenuItem key='tercerizada' value='tercerizada'>Empresa tercerizada</MenuItem>
                                <MenuItem key='periodista' value='periodista'>Periodista</MenuItem>
                            </TextField>
                            <TextField id='nombre' label='Nombre' variant='outlined' type='text'/>
                        </div>
                        <div className='add-field-habilitacion'>
                            <Autocomplete disablePortal id='combo-box' options={['Canal 13','Coca-Cola','Hnorable cámara de diputados','C5N','TN']} 
                                sx={{ width: 330 }}
                                renderInput={(params) => <TextField {...params} label='Empresa / Organismo' />}
                            />
                        </div>
                        <div className='add-field-habilitacion'>
                            <p>Desde: </p>
                            <DatePicker label='Fecha desde'/>
                            <TimePicker label='Hora Desde'/>
                        </div>
                        <div className='add-field-habilitacion'>
                            <p>Hasta: </p>
                            <DatePicker label='Fecha hasta'/>
                            <TimePicker label='Hora hasta'/>
                        </div>
                        <div className='add-field-habilitacion'>
                            <TextField label='Observaciones'/>
                        </div>
                    </div>
                    <LoadingButton
                      color='success'
                      onClick={handleAddHabilitacion}
                      loading={loadingHabilitacion}
                      loadingPosition='start'
                      startIcon={<SaveIcon />}
                      variant='outlined'
                    >
                      <span>Guardar</span>
                    </LoadingButton>
                </Box>
            </Modal>
            <DataGrid
                disableRowSelectionOnClick={true}
                sx={{height: '350px'}}
                loading={loading}
                rows={habilitaciones}
                columns={gridColumns}
                autoPageSize
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <Button sx={{marginTop: '20px'}} onClick={addHabilitacion} variant='outlined' startIcon={<AddIcon/>}>Añadir habilitación</Button>
        </div>
    )
}

export default HabilitacionesTab;