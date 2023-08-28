import React, { useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import Modal from "@mui/material/Modal";
import AddIcon from '@mui/icons-material/Add';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import toast, {Toaster} from "react-hot-toast";
import EditIcon from '@mui/icons-material/Edit';
import { stylesModal } from "../../../../styles/customStyles";

const TiposBien = () => {
    const [loading,setLoading] = useState(false);
    const [selected,setSelected] = useState({});
    const [openBorrar,setOpenBorrar] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [bienes,setBienes] = useState([
        {id: 1, descripcion: "Notebook",grupo: "Equipamiento informático"},
        {id: 2, descripcion: "PC",grupo: "Equipamiento informático"},
        {id: 3, descripcion: "Monitor",grupo: "Equipamiento informático"},
        {id: 4, descripcion: "Teclado",grupo: "Equipamiento informático"},
        {id: 5, descripcion: "Celular",grupo: "Telefonía"},
    ]);
    const bienesColumns = [
        {field: "descripcion", headerName: "Descripción", width: 400},
        {field: "grupo", headerName: "Grupo", width: 400},
        {field: "acciones",disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: "Acciones",sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={(e)=>{editarTipoBien(e,params.row)}} color="success" aria-label="edit">
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarTipoBien(e,params.row)}} color="error" aria-label="delete">
                        <DeleteIcon onClick={(e)=>{borrarTipoBien(e,params.row)}}/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const editarTipoBien = (e,data) => {

    }
    const borrarTipoBien = (e,data) => {
        setSelected(data);
        setOpenBorrar(true);
    }
    const addTipoBien = () => {
        setOpenAdd(true);
    }
    const confirmarNuevoTipoBien = async () => {
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
                    <h1 className="confirmation-text">¿Confirma que desea borrar la empresa u organismo seleccionado?</h1>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <Button color="success" variant="outlined">Si</Button>
                        <Button onClick={handleCloseBorrar} color="error" variant="outlined">No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={stylesModal}>
                    <h1 className="confirmation-text">Añadir tipo de bienes</h1>
                    <Box sx={{display: "flex",flexDirection: "column",alignItems: "center", marginBottom: "20px"}}>
                        <TextField id="tipo-bien" label="Descripción del tipo" variant="outlined" type="text"/>
                    </Box>
                    <Box sx={{display: "flex",flexDirection: "column",alignItems: "center", marginBottom: "20px"}}>
                        <TextField id="grupo-bien" select label="Grupo de bienes" defaultValue="informatico">
                            <MenuItem key="informatico" value="informatico">Equipamiento informático</MenuItem>
                            <MenuItem key="comunicacion" value="comunicacion">Equipo de comunicación</MenuItem>
                        </TextField>
                    </Box>
                    <Button sx={{marginTop: "20px"}} onClick={confirmarNuevoTipoBien} variant="outlined" color="success" startIcon={<AddIcon/>}>Confirmar</Button>
                </Box>
            </Modal>
            <div className="content-header">
                <PersonalVideoIcon sx={{fontSize: 40}}/>
                <h3>Tipos de bienes</h3>
            </div>
            <DataGrid
            disableRowSelectionOnClick={true}
            sx={{height: "80%"}}
                loading={loading}
                rows={bienes}
                columns={bienesColumns}
                autoPageSize
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <Button sx={{marginTop: "20px"}} onClick={addTipoBien} variant="outlined" startIcon={<AddIcon/>}>Añadir grupo de bienes</Button>
        </>
    )
}

export default TiposBien;