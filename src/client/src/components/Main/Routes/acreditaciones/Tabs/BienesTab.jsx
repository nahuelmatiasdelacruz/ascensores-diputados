import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import Modal from "@mui/material/Modal";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { stylesModal } from "../../../../../styles/customStyles";

const BienesTab = () => {
    const [selected,setSelectedRow] = useState({});
    const [loading,setLoading] = useState(false);
    const [openBorrar,setOpenBorrar] = useState(false);
    const [openEditarBien,setOpenEditarBien] = useState(false);
    const [bienes,setBienes] = useState([
        {
            id: 1,
            descripcion: "Descripcion de ejemplo de bien",
            tipo: "Notebook",
            grupo: "Equipamiento informático",
            marca: "Asus",
            modelo: "Zenbook"
        },
        {
            id: 2,
            descripcion: "Otra descripcion de ejemplo de bien",
            tipo: "Celular",
            grupo: "Equipamiento informático",
            marca: "SAMSUNG",
            modelo: "A22 5G"
        },
        {
            id: 3,
            descripcion: "Algo diferente",
            tipo: "Notebook",
            grupo: "Equipamiento informático",
            marca: "HP",
            modelo: "EliteBook"
        },
        {
            id: 4,
            descripcion: "Mas ejemplos",
            tipo: "Notebook",
            grupo: "Equipamiento informático",
            marca: "Sony",
            modelo: "Vaio"
        },
    ]);
    const handleCloseEditar = () => {
        setOpenEditarBien(false);
    }
    const handleCloseBorrar = () =>{
        setOpenBorrar(false);
    }
    const borrarBien = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenBorrar(true);
    }
    const editarBien = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenEditarBien(true);
    }
    const gridColumns = [
        {field: "id", headerName: "ID", width: 100},
        {field: "descripcion", headerName: "Descripción", width: 250},
        {field: "tipo",headerName: "Tipo", width: 200},
        {field: "marca", headerName: "Marca", width: 230},
        {field: "modelo",headerName: "Modelo", width: 250},
        {field: "grupo",headerName: "Grupo", width: 250},
        {field: "actions",disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: "Acciones",sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={(e)=>{editarBien(e,params.row)}} color="success" aria-label="edit">
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarBien(e,params.row)}} color="error" aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    useEffect(()=>{

    },[])
    return(
        <>  
            <Modal open={openBorrar} onClose={handleCloseBorrar} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={stylesModal}>
                    <h1 className="confirmation-text">¿Confirma que desea borrar?</h1>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <Button color="success" variant="outlined">Si</Button>
                        <Button color="error" variant="outlined">No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={openEditarBien} onClose={handleCloseEditar} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={stylesModal}>
                    <Box component="form" sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
                        <div className="content-header">
                            <h3>Editar bien</h3>
                        </div>
                        <TextField id="tipobien" select label="Tipo de bien" defaultValue="notebook">
                            <MenuItem key="notebook" value="notebook">Notebook (Equipamiento informático)</MenuItem>
                            <MenuItem key="celular" value="celular">Celular</MenuItem>
                        </TextField>
                        <TextField id="descripcion" label="Descripción" variant="outlined" type="text"/>
                        <TextField id="marca" label="Marca" variant="outlined" type="text"/>
                        <TextField id="modelo" label="Modelo" variant="outlined" type="text"/>
                        <TextField id="proveedor" label="Proveedor" variant="outlined" type="text"/>
                        <TextField id="npatrimonio" label="Numero patrimonio" variant="outlined" type="number"/>
                        <TextField id="observaciones" label="Observaciones" variant="outlined" multiline type="text"/>
                    </Box>
                    <Stack direction="row" spacing={5} marginTop="30px" justifyContent="center">
                        <Button color="success" variant="outlined">Confirmar cambios</Button>
                        <Button color="error" variant="outlined">Cancelar</Button>
                    </Stack>
                </Box>
            </Modal>
            <DataGrid
                disableRowSelectionOnClick={true}
                sx={{height: "400px"}}
                loading={loading}
                rows={bienes}
                columns={gridColumns}
                autoPageSize
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </>
    )
}

export default BienesTab;