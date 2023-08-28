import { useEffect, useState } from "react";
import {MUIButtons,MUIDisplay,MUIIcons,MUILayout,MUINavigation,MUITools} from "../../../../helpers/MaterialImports";
import {server} from "../../../../helpers/constants";
import toast, {Toaster} from "react-hot-toast";
import axios from "axios";

const Periodos = () => {
    const [loading,setLoading] = useState(false);
    const [periodos,setPeriodos] = useState([]);
    const [selected,setSelected] = useState({});
    const [openEditar,setOpenEditar] = useState(false);
    const [openBorrar,setOpenBorrar] = useState(false);
    const [openAdd,setOpenAdd] = useState(false);
    const [nuevoPeriodo,setNuevoPeriodo] = useState({});
    const addPeriodo = () => {
        setOpenAdd(true);
    }
    const editarPeriodo = (e,data) => {
        setSelected(data);
        setOpenEditar(true);
    }
    const borrarPeriodo = (e,data) => {
        setSelected(data);
        setOpenBorrar(data);
    }
    const periodosColumns = [
        {field: "descripcion", headerName: "Descripción", width: 200},
        {field: "actions", headerName: "Acciones", width: 200, renderCell: (params)=>{
            return(
                <>
                    <MUILayout.Stack direction="row">
                        <MUIButtons.IconButton color="success" onClick={(e)=>{editarPeriodo(e,params.row)}}>
                            <MUIIcons.EditIcon/>
                        </MUIButtons.IconButton>
                        <MUIButtons.IconButton color="error" onClick={(e)=>{borrarPeriodo(e,params.row)}}>
                            <MUIIcons.DeleteIcon/>
                        </MUIButtons.IconButton>
                    </MUILayout.Stack>
                </>
            )
        }},
    ]
    const getPeriodos = async () => {
        try{
            const response = await axios.get(`${server}/api/configuracion/periodos`);
            setPeriodos(response.data);
        }catch(e){
            toast.error("Error al buscar los periodos");
        }
    }
    const addNuevoPeriodo = () => {

    }
    const setDesde = () => {

    }
    const setHasta = () => {

    }
    useEffect(()=>{
        getPeriodos();
    },[])
    return (
        <>
            <Toaster/>
            <div className="content-header">
                <MUIIcons.DateRangeIcon sx={{fontSize: 40}}/>
                <h3>Periodos</h3>
            </div>
            <MUILayout.DataGrid
                columns={periodosColumns}
                rows={periodos}
                disableRowSelectionOnClick={true}
                autoPageSize
                sx={{height: "80%"}}
                localeText={MUILayout.esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <MUIButtons.Button sx={{marginTop: 2}} onClick={addPeriodo} color="success" variant="outlined">Añadir periodo legislativo</MUIButtons.Button>
        </>
    )
}

export default Periodos;