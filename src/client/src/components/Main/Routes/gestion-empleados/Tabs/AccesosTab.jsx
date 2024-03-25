import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {server} from "../../../../../helpers/constants";

// Material UI
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import Modal from "@mui/material/Modal";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { stylesModal } from '../../../../../styles/customStyles';
import { toast } from 'react-hot-toast';

const AccesosTab = ({userData}) => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [selected,setSelected] = useState({});
    
    // Asociados 
    const [equiposAsociados,setEquiposAsociados] = useState([]);
    const [gruposAsociados,setGruposAsociados] = useState([]);

    // Para asociar
    const [equiposParaAsociar, setEquiposParaAsociar] = useState([]);
    const [gruposParaAsociar,setGruposParaAsociar] = useState([]);
    
    // Controles modales
    const [modalAgregarEquipo,setModalAgregarEquipo] = useState(false);
    const [modalBorrarEquipo,setOpenModalBorrarEquipo] = useState(false);
    const [modalAgregarGrupo,setModalAgregarGrupo] = useState(false);
    const [modalBorrarGrupo,setModalBorrarGrupo] = useState(false);

    // Asincronas
    const confirmarBorrarEquipo = async () => {
        try{
            await axios.delete(`${server}/api/dispositivos/asociados/${selected.equipo_empleado_id}/${userData.empleado_id}/${selected.equipo_id}`);
            await getData();
            setSelected({});
            handleCloseBorrarEquipo();
        }catch(e){
            toast.error("Hubo un error al borrar el equipo asociado")
            setSelected({});
            handleCloseBorrarEquipo();
        }
    }
    const confirmarBorrarGrupoAsociado = async () => {
        try{
            await axios.delete(`${server}/api/grupos/asociados/delete/${selected.grupo_empleado_id}`);
            await getData();
            setSelected({});
            handleCloseBorrarGrupo();
        }  catch(e){
            toast.error("Hubo un error al borrar el grupo asociado");
            setSelected({});
            handleCloseBorrarGrupo();
        }
    }
    const getGruposAsociados = async () => {
        try{
            const result = await axios.get(`${server}/api/grupos/asociados/${userData.empleado_id}`);
            setGruposAsociados(result.data.asociados);
            setGruposParaAsociar(result.data.disponibles);
        }catch(e){
            console.log(e.message);
        }
    }
    const getEquiposAsociados = async () => {
        try{
            const result = await axios.get(`${server}/api/dispositivos/asociados/${userData.empleado_id}`);
            setEquiposAsociados(result.data.asociados);
            setEquiposParaAsociar(result.data.disponibles);
        }catch(e){

        }
    }
    const confirmarAgregado = async () => {
        setLoading(true);
        try{
            await axios.post(`${server}/api/grupos/asociar`,{
                empleado_id: userData.empleado_id,
                grupo_id: selected.id
            });
        }catch(e){
            console.log(e.message);
        }
        await getData();
        setSelected({});
        setModalAgregarGrupo(false);
        setLoading(false);
    }
    const confirmarAgregadoEquipo = async () => {
        setLoading(true);
        try{
            await axios.post(`${server}/api/dispositivos/asociar`,{
                empleado_id: userData.empleado_id,
                equipo_id: selected.id
            });
        }catch(e){
            console.log(e.message);
        }
        await getData();
        setSelected({});
        setModalAgregarEquipo(false);
        setLoading(false);
    }
    const borrarDispositivoSeleccionado = (e,data) => {
        e.stopPropagation();
        setSelected(data);
        setOpenModalBorrarEquipo(true);
    }
    const borrarGrupoSeleccionado = (e,data) => {
        e.stopPropagation();
        setSelected(data);
        setModalBorrarGrupo(true);
    }
    const handleCloseBorrarEquipo = () => {
        setSelected({});
        setOpenModalBorrarEquipo(false);
    }
    const handleCloseBorrarGrupo = () => {
        setSelected({});
        setModalBorrarGrupo(false);
    }
    const editarGrupoRow = () => {
        navigate("/equipos/grupos");
    }
    const handleCloseAgregarGrupo = () => {
        setModalAgregarGrupo(false);
    }
    const handleCloseAgregarEquipo = () => {
        setSelected({});
        setModalAgregarEquipo(false);
    }
    const setGrupoParaAsociar = (e,grupo) => {
        if(grupo){
            setSelected(grupo);
            setModalAgregarGrupo(true);
        }
    }
    const setEquipoParaAsociar = (e,equipo) => {
        if(equipo){
            setSelected(equipo);
            setModalAgregarEquipo(true);
        }
    }
    /* Columnas de grids */
    const equiposAsociadosColumns = [
        {field: "id", headerName: "ID", width: 100},
        {field: "descripcion", headerName: "Descripción", width: 200},
        {field: "delete",disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: "Eliminar",sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={(e)=>{borrarDispositivoSeleccionado(e,params.row)}} color="error" aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ];
    const gruposAsociadosColumns = [
        {field: "id",headerName: "ID"},
        {field: "grupo", headerName: "Descripción", width: 200},
        {field: "delete",disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: "Eliminar",sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={()=>{navigate("/equipos/grupos")}} color="success" aria-label="edit">
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarGrupoSeleccionado(e,params.row)}} color="error" aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const getData = async () => {
        setLoading(true);
        await getGruposAsociados();
        try{
            await getEquiposAsociados();
        }catch(e)
        {
            console.log(e.message);
        }
        setLoading(false);
    }
    useEffect(()=>{
        getData();
    },[]);
    return(
        <div className="accesos-container">
            <Modal open={modalAgregarGrupo} onClose={handleCloseAgregarGrupo} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={stylesModal}>
                    <h1 style={{textAlign: "center"}} className="confirmation-text">¿Confirma que desea asociar el grupo <span>{selected?.label}</span> al usuario <span>{userData?.nombre + " " + userData?.apellido}</span>?</h1>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <Button onClick={confirmarAgregado} color="success" variant="outlined">Si</Button>
                        <Button onClick={handleCloseAgregarGrupo} color="error" variant="outlined">No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={modalAgregarEquipo} onClose={handleCloseAgregarEquipo} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={stylesModal}>
                    <h1 style={{textAlign: "center"}} className="confirmation-text">¿Confirma que desea asociar el equipo <span>{selected?.label}</span> al usuario <span>{userData?.nombre + " " + userData?.apellido}</span>?</h1>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <Button onClick={confirmarAgregadoEquipo} color="success" variant="outlined">Si</Button>
                        <Button onClick={handleCloseAgregarEquipo} color="error" variant="outlined">No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={modalBorrarGrupo} onClose={handleCloseBorrarGrupo}>
                <Box sx={stylesModal}>
                    <h1 style={{textAlign: "center"}} className="confirmation-text">¿Desea eliminar de la lista de asociados el grupo seleccionado?</h1>
                    <h2 style={{textAlign: "center"}} className="confirmation-text"><span>{selected?.grupo}</span></h2>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <Button onClick={confirmarBorrarGrupoAsociado} color="success" variant="outlined">Si</Button>
                        <Button onClick={handleCloseBorrarGrupo} color="error" variant="outlined">No</Button>
                    </Stack>
                </Box>
            </Modal>
            <Modal open={modalBorrarEquipo} onClose={handleCloseBorrarEquipo}>
                <Box sx={stylesModal}>
                    <h1 style={{textAlign: "center"}} className="confirmation-text">¿Desea eliminar de la lista de asociados el equipo seleccionado?</h1>
                    <h2 style={{textAlign: "center"}} className="confirmation-text"><span>{selected?.descripcion}</span></h2>
                    <Stack spacing={4} direction="row" justifyContent="center">
                        <Button onClick={confirmarBorrarEquipo} color="success" variant="outlined">Si</Button>
                        <Button onClick={handleCloseBorrarEquipo} color="error" variant="outlined">No</Button>
                    </Stack>
                </Box>
            </Modal>
            <div className="grupos">
                <h4>Grupos de accesos</h4>
                <Box sx={{width:"500px",margin:"0 0 10px 0", height: "400px"}}>
                    <DataGrid
                        onRowClick={editarGrupoRow}
                        disableRowSelectionOnClick={true}
                        sx={{height: "80%"}}
                        loading={loading}
                        rows={gruposAsociados}
                        columns={gruposAsociadosColumns}
                        autoPageSize
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    />
                    <Autocomplete 
                        onChange={setGrupoParaAsociar}
                        loading={loading} size="small" disablePortal id="combo-box" options={gruposParaAsociar} 
                        sx={{ width: 330 , marginBottom: 2, marginTop: 2}}
                        renderInput={(params) => <TextField {...params} label="Buscar grupo"/>}
                    />
                </Box>
            </div>
            <div className="equipos">
                <h4>Equipos específicos</h4>
                <Box sx={{width:"500px",margin:"0 0 10px 0", height: "400px"}}>
                    <DataGrid
                        onRowClick={editarGrupoRow}
                        disableRowSelectionOnClick={true}
                        sx={{height: "80%"}}
                        loading={loading}
                        rows={equiposAsociados}
                        columns={equiposAsociadosColumns}
                        autoPageSize
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    />
                    <Autocomplete
                        onChange={setEquipoParaAsociar}
                        loading={loading} size="small" disablePortal id="combo-box" options={equiposParaAsociar} 
                        sx={{ width: 330 , marginBottom: 2, marginTop: 2}}
                        renderInput={(params) => <TextField {...params} label="Buscar equipo"/>}
                    />
                </Box>
            </div>
        </div>
    )
}

export default AccesosTab;