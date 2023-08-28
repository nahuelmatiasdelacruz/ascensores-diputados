import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import Modal from "@mui/material/Modal";
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import { stylesModal } from "../../../../styles/customStyles";
import EditTabs from "./EditTabs";

const Acreditaciones = () => {
    const [selected,setSelectedRow] = useState({});
    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);
    const [openAcreditacion,setOpenAcreditacion] = useState(false);
    const [acreditaciones,setAcreditaciones] = useState([]);
    const handleClose = () => {
        setOpen(false);
    }
    const handleCloseAcreditacion = () =>{
        setOpenAcreditacion(false);
    }
    const borrarAcreditacion = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpen(true);
    }
    const editarAcreditacion = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenAcreditacion(true);
    }
    const gridColumns = [
        {field: "apellidoNombre", headerName: "Apellido y Nombre", width: 200},
        {field: "documento", headerName: "Documento", width: 200},
        {field: "tipoHabilitacion",headerName: "Tipo Habilitacion", width: 200},
        {field: "empresaOrganismo", headerName: "Empresa / Organismo", width: 230},
        {field: "fechaHoraDesde",headerName: "Fecha y Hora: Desde", width: 250},
        {field: "fechaHoraHasta",headerName: "Fecha y Hora: Hasta", width: 250},
        {field: "actions",disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: "Acciones",sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={(e)=>{editarAcreditacion(e,params.row)}} color="success" aria-label="edit">
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarAcreditacion(e,params.row)}} color="error" aria-label="delete">
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
            <div className="content-header">
                <BadgeRoundedIcon sx={{fontSize: 40}}/>
                <h3>Acreditaciones</h3>
            </div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={stylesModal}>
                    <h1 className="confirmation-text">¿Confirma que desea borrar las acreditaciones de: <span>{selected?.apellidoNombre}</span>?</h1>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <Button color="success" variant="outlined">Si</Button>
                        <Button color="error" variant="outlined">No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={openAcreditacion} onClose={handleCloseAcreditacion} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <React.Fragment>
                    <EditTabs data={selected}/>
                </React.Fragment>
            </Modal>
            <DataGrid
                disableRowSelectionOnClick={true}
                sx={{height: "80%"}}
                loading={loading}
                rows={acreditaciones}
                columns={gridColumns}
                autoPageSize
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </>
    )
}

export default Acreditaciones;