import React, { useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import HttpsIcon from '@mui/icons-material/Https';
import Modal from "@mui/material/Modal";
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import toast, {Toaster} from "react-hot-toast";
import EditIcon from '@mui/icons-material/Edit';
import { stylesModal } from "../../../../styles/customStyles";

const Permisos = () => {
    const [loading,setLoading] = useState(false);
    const [selected,setSelected] = useState({});
    const [openBorrar,setOpenBorrar] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [permisos,setPermisos] = useState([]);
    const permisosColumns = [
        {field: "nombre", headerName: "Nombre", width: 200},
        {field: "descripcion", headerName: "Descripción", width: 400},
        {field: "acciones",disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: "Acciones",sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={(e)=>{editarPermiso(e,params.row)}} color="success" aria-label="edit">
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarPermiso(e,params.row)}} color="error" aria-label="delete">
                        <DeleteIcon onClick={(e)=>{borrarPermiso(e,params.row)}}/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const editarPermiso = (e,data) => {

    }
    const borrarPermiso = (e,data) => {
        setSelected(data);
        setOpenBorrar(true);
    }
    const addPermiso = () => {
        setOpenAdd(true);
    }
    const confirmarNuevoPermiso = async () => {
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
            <Modal open={openBorrar} onClose={handleCloseBorrar} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={stylesModal}>
                    <h1 className="confirmation-text">¿Confirma que desea borrar el permiso seleccionado?</h1>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <Button color="success" variant="outlined">Si</Button>
                        <Button onClick={handleCloseBorrar} color="error" variant="outlined">No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={stylesModal}>
                    <h1 className="confirmation-text">Añadir permiso</h1>
                    <Box sx={{display: "flex",flexDirection: "column",alignItems: "center", marginBottom: "20px"}}>
                        <TextField id="tipo-bien" label="Nombre del permiso" variant="outlined" type="text"/>
                    </Box>
                    <Box sx={{display: "flex",flexDirection: "column",alignItems: "center", marginBottom: "20px"}}>
                        <TextField id="tipo-bien" label="Descripción del permiso" variant="outlined" type="text"/>
                    </Box>
                    <Button sx={{marginTop: "20px"}} onClick={confirmarNuevoPermiso} variant="outlined" color="success" startIcon={<AddIcon/>}>Confirmar</Button>
                </Box>
            </Modal>
            <div className="content-header">
                <HttpsIcon sx={{fontSize: 40}}/>
                <h3>Permisos</h3>
            </div>
            <DataGrid
            disableRowSelectionOnClick={true}
                loading={loading}
                rows={permisos}
                columns={permisosColumns}
                autoPageSize
                sx={{height: "80%"}}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <Button sx={{marginTop: "20px"}} onClick={addPermiso} variant="outlined" startIcon={<AddIcon/>}>Añadir permiso</Button>
        </>
    )
}

export default Permisos;