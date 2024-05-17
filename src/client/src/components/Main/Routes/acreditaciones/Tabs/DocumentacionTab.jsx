import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { stylesModal } from '../../../../../styles/customStyles';

const DocumentacionesTab = () => {
    const [openDelete,setOpenDelete] = useState(false);
    const [loadingEdit,setLoadingEdit] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [openEdit,setOpenEdit] = useState(false);
    const [selected,setSelected] = useState({});
    const [loadingAdd,setLoadingAdd] = useState(false);
    const [loading,setLoading] = useState(false);
    const [documentaciones,setDocumentaciones] = useState([
        {
            id: 1,
            descripcion: 'Prueba 1',
            tipo: 'ART',
            fecha: '15-03-2023'
        },
        {
            id: 2,
            descripcion: 'Prueba 3',
            tipo: 'Seguro',
            fecha: '15-03-2023'
        },
        {
            id: 3,
            descripcion: 'Prueba 1',
            tipo: 'Convenio',
            fecha: '15-03-2023'
        },
    ]);
    const handleClose = ()=>{
        setOpenDelete(false);
    }
    const handleDeleteDoc = (e,data) => {
        e.stopPropagation();
        setSelected(data);
        setOpenDelete(true);
    }
    const handleCloseEdit = ()=>{
        setOpenEdit(false);
    }
    const addDocumentacion = () => {
        setOpenAdd(true);
    }
    const handleAdd = async () => {
        setOpenAdd(false);
    }
    const handleCloseAdd = () => {
        setOpenAdd(false);
    }
    const editarDocumentacion = async (e,data)=>{
        e.stopPropagation();
        setOpenEdit(true);
    }
    const gridColumns = [
        {field: 'descripcion', headerName: 'Descripción', width: 200},
        {field: 'tipo', headerName: 'Tipo', width: 200},
        {field: 'fecha',headerName: 'Fecha', width: 250},
        {field: 'actions',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{editarDocumentacion(e,params.row)}} color='success' aria-label='edit'>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{handleDeleteDoc(e,params.row)}} color='error' aria-label='delete'>
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }}
    ]
    return(
        <>
            <Modal open={openDelete} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>¿Confirma que desea borrar la documentación?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button color='success' variant='outlined'>Si</Button>
                        <Button color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h3 className='doc-detail'>Detalle de documentación</h3>
                    <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                        <TextField id='doctype' select label='Tipo de documentacion' defaultValue='artSeguro'>
                          <MenuItem key='artseguro' value='artSeguro'>ART / Seguro</MenuItem>
                          <MenuItem key='convenio' value='convenio'>Convenio</MenuItem>
                          <MenuItem key='notaAcceso' value='notaAcceso'>Nota pedido de acceso</MenuItem>
                          <MenuItem key='otro' value='otro'>Otro</MenuItem>
                        </TextField>
                        <TextField id='descripcion' label='Descripcion' variant='outlined' type='text'/>
                    </Box>
                    <LoadingButton
                      color='success'
                      onClick={editarDocumentacion}
                      loading={loadingEdit}
                      loadingPosition='start'
                      startIcon={<SaveIcon />}
                      variant='outlined'
                    >
                      <span>Guardar cambios</span>
                    </LoadingButton>
                </Box>
            </Modal>
            <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h3 className='doc-detail'>Detalle de nueva documentación</h3>
                    <Box component='form' sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete='off'>
                        <TextField id='doctype' select label='Tipo de documentacion' defaultValue='artSeguro'>
                          <MenuItem key='artseguro' value='artSeguro'>ART / Seguro</MenuItem>
                          <MenuItem key='convenio' value='convenio'>Convenio</MenuItem>
                          <MenuItem key='notaAcceso' value='notaAcceso'>Nota pedido de acceso</MenuItem>
                          <MenuItem key='otro' value='otro'>Otro</MenuItem>
                        </TextField>
                        <TextField id='descripcion' label='Descripcion' variant='outlined' type='text'/>
                    </Box>
                    <LoadingButton
                      color='success'
                      onClick={addDocumentacion}
                      loading={loadingAdd}
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
                rows={documentaciones}
                columns={gridColumns}
                autoPageSize
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <Button sx={{marginTop: '20px'}} onClick={addDocumentacion} variant='outlined' startIcon={<AddIcon/>}>Añadir documentación</Button>
        </>
    )
}

export default DocumentacionesTab;