import React, { useState } from 'react';
import {GroupsIcon,DataGrid,DeleteIcon,esES,Box,Modal,AddIcon,TextField,Stack,IconButton,Button,EditIcon} from '../../..';
import {Toaster} from 'react-hot-toast';
import { stylesModal } from '../../../../styles/customStyles';

export const TiposHabilitacion = () => {
    const [loading,setLoading] = useState(false);
    const [selected,setSelected] = useState({});
    const [openBorrar,setOpenBorrar] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [tipos,setTipos] = useState([
        {id: 1, descripcion: 'Periodista'},
        {id: 2, descripcion: 'Proveedor'},
        {id: 3, descripcion: 'Empresa tercerizada'},
    ]);
    const tiposColumns = [
        {field: 'descripcion', headerName: 'Descripción', width: 400},
        {field: 'acciones',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{editarTipo(e,params.row)}} color='success' aria-label='edit'>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarTipo(e,params.row)}} color='error' aria-label='delete'>
                        <DeleteIcon onClick={(e)=>{borrarTipo(e,params.row)}}/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const editarTipo = (e,data) => {

    }
    const borrarTipo = (e,data) => {
        setSelected(data);
        setOpenBorrar(true);
    }
    const addTipo = () => {
        setOpenAdd(true);
    }
    const confirmarNuevoTipo = async () => {
        setOpenAdd(false);
    }
    const handleCloseBorrar = () => {
        setOpenBorrar(false);
    }
    const handleCloseAdd = () => {
        setOpenAdd(false);
    }
    return(
        <>
            <Toaster/>
            <Modal open={openBorrar} onClose={handleCloseBorrar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>¿Confirma que desea borrar el tipo de habilitación seleccionado?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button color='success' variant='outlined'>Si</Button>
                        <Button onClick={handleCloseBorrar} color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>Añadir tipo de habilitación</h1>
                    <Box sx={{display: 'flex',flexDirection: 'column',alignItems: 'center', marginBottom: '20px'}}>
                        <TextField id='tipo-bien' label='Descripción del tipo' variant='outlined' type='text'/>
                    </Box>
                    <Button sx={{marginTop: '20px'}} onClick={confirmarNuevoTipo} variant='outlined' color='success' startIcon={<AddIcon/>}>Confirmar</Button>
                </Box>
            </Modal>
            <div className='content-header'>
                <GroupsIcon sx={{fontSize: 40}}/>
                <h3>Tipos de habilitación</h3>
            </div>
            <DataGrid
            disableRowSelectionOnClick={true}
                sx={{height: '80%'}}
                loading={loading}
                rows={tipos}
                columns={tiposColumns}
                autoPageSize
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <Button sx={{marginTop: '20px'}} onClick={addTipo} variant='outlined' startIcon={<AddIcon/>}>Añadir tipo de habilitación</Button>
        </>
    )
};