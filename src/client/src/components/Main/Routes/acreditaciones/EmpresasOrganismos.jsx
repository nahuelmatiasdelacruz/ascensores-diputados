import React, { useState } from 'react';
import {Toaster} from 'react-hot-toast';
import {DataGrid,esES,Box,BadgeRoundedIcon,Modal,AddIcon,TextField,Stack,IconButton,Button,DeleteIcon,EditIcon} from '../../../';
import { stylesModal } from '../../../../styles/customStyles';

export const EmpresasOrganismos = () => {
    const [loading,setLoading] = useState(false);
    const [selected,setSelected] = useState({});
    const [openBorrar,setOpenBorrar] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [empresas,setEmpresas] = useState([
        {id: 1, descripcion: 'Coca-Cola'},
        {id: 2, descripcion: 'OPDS'},
        {id: 3, descripcion: 'Coto S.A'},
        {id: 4, descripcion: 'Canal 13'},
        {id: 5, descripcion: 'C5N'},
    ]);
    const empresasColumns = [
        {field: 'descripcion', headerName: 'Descripción', width: 400},
        {field: 'acciones',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{editarEmpresa(e,params.row)}} color='success' aria-label='edit'>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarEmpresa(e,params.row)}} color='error' aria-label='delete'>
                        <DeleteIcon onClick={(e)=>{borrarEmpresa(e,params.row)}}/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const editarEmpresa = (e,data) => {

    }
    const borrarEmpresa = (e,data) => {
        setSelected(data);
        setOpenBorrar(true);
    }
    const addEmpresa = () => {
        setOpenAdd(true);
    }
    const confirmarNuevaEmpresa = async () => {
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
                    <h1 className='confirmation-text'>¿Confirma que desea borrar la empresa u organismo seleccionado?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button color='success' variant='outlined'>Si</Button>
                        <Button onClick={handleCloseBorrar} color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <Box sx={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                        <h1 className='confirmation-text'>Añadir empresa u organismo</h1>
                        <TextField id='nombre-empresa' label='Nombre de la empresa u organismo' variant='outlined' type='text'/>
                    </Box>
                    <Button sx={{marginTop: '20px'}} onClick={confirmarNuevaEmpresa} variant='outlined' color='success' startIcon={<AddIcon/>}>Confirmar</Button>
                </Box>
            </Modal>
            <div className='content-header'>
                <BadgeRoundedIcon sx={{fontSize: 40}}/>
                <h3>Empresas y organismos</h3>
            </div>
            <DataGrid
            disableRowSelectionOnClick={true}
                sx={{height: '80%'}}
                loading={loading}
                rows={empresas}
                columns={empresasColumns}
                autoPageSize
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <Button sx={{marginTop: '20px'}} onClick={addEmpresa} variant='outlined' startIcon={<AddIcon/>}>Añadir empresa / Organismo</Button>
        </>
    )
};