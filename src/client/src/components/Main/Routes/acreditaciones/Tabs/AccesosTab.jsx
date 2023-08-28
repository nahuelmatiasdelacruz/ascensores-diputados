import React, { useState } from "react";
import loadingFinger from "../../../../../img/loadingFinger.gif";
import toast, {Toaster} from "react-hot-toast";
import { stylesModal } from "../../../../../styles/customStyles";
import { styled } from '@mui/material/styles';
import { MUIButtons, MUIIcons, MUIInputs, MUIDisplay, MUILayout, MUINavigation, MUITools } from "../../../../../helpers/MaterialImports";

const AccesosTab = () => {
    const IOSSwitch = styled((props) => (
        <MUIInputs.Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
      ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[600],
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
          opacity: 1,
          transition: theme.transitions.create(['background-color'], {
            duration: 500,
          }),
        },
    }));
    const [loading,setLoading] = useState(false);
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [openEditar,setOpenEditar] = useState(false);
    const [selectedRow,setSelectedRow] = useState({});
    const [selectedRoller,setSelectedRoller] = useState("");
    const [openBorrar,setOpenBorrar] = useState(false);
    const [scanningFinger,setScanningFinger] = useState(false);
    const [tarjetas,setTarjetas] = useState([]);
    const [grupos,setGrupos] = useState([]);
    const [gruposAcceso,setGruposAcceso] = useState([]);
    const [huellas,setHuellas] = useState([]);
    
    const setNewRoller = (e) => {
        setSelectedRoller(e.target.value);
    }
    const setNewGroup = (e)=>{
        
    }
    const setNewGroupAccess = (e)=>{
        
    }
    const addHuella = () => {
        setOpenModalAdd(true);
    }
    const handleCloseEditar = () => {
        setOpenEditar(false);
    }
    const handleCloseAdd = () => {
        setOpenModalAdd(false);
    }
    const handleCloseBorrar = () =>{
        setOpenBorrar(false);
    }
    const borrarHuella = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenBorrar(true);
    }
    const editarHuella = async (e,data)=>{
        e.stopPropagation();
        setSelectedRow(data);
        setOpenEditar(true);
    }
    const startScan = () => {
        if(selectedRoller!==""){
            setScanningFinger(true);
            setTimeout(()=>{
                setScanningFinger(false);
                setOpenEditar(false);
                toast.success("Se ha escaneado la huella con éxito!");
            },2000)    
        }else{
            toast.error("Por favor seleccione un enrolador");
            return;
        }
    }
    const gridColumns = [
        {field: "descripcion", headerName: "Descripción", width: 300},
        {field: "actions",disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: "Acciones",sortable: false,width: 130,renderCell: (params)=>{
            return(
                <MUIButtons.Stack direction="row" spacing={1}>
                    <MUIIcons.IconButton onClick={(e)=>{editarHuella(e,params.row)}} color="success" aria-label="edit">
                        <MUIButtons.EditIcon/>
                    </MUIIcons.IconButton>
                    <MUIButtons.IconButton onClick={(e)=>{borrarHuella(e,params.row)}} color="error" aria-label="delete">
                        <MUIButtons.DeleteIcon/>
                    </MUIButtons.IconButton>
                </MUIButtons.Stack>
            )
        }},
    ]
    const tarjetasColumns = [
        {field: "id", headerName: "ID", width:150},
        {field: "actions",disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: "Habilitada",sortable: false,width: 130,renderCell: (params)=>{
            return(
                <MUIButtons.Stack direction="row" spacing={1}>
                    <MUIInputs.FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked={params.row.estado}/>}/>
                </MUIButtons.Stack>
            )
        }},
    ]

    return(
        <div className="accesos-container">
            <MUIInputs.Modal open={openBorrar} onClose={handleCloseBorrar} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <MUILayout.Box sx={stylesModal}>
                    <h1 className="confirmation-text">¿Confirma que desea borrar la huella?</h1>
                    <MUIButtons.Stack spacing={4} direction="row" justifyContent="center">
                        <MUIButtons.Button color="success" variant="outlined">Si</MUIButtons.Button>
                        <MUIButtons.Button color="error" variant="outlined">No</MUIButtons.Button>
                    </MUIButtons.Stack>
                </MUILayout.Box>
            </MUIInputs.Modal>
            <MUIInputs.Modal open={openEditar} onClose={handleCloseEditar} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <MUILayout.Box sx={stylesModal}>
                    <MUILayout.Box component="form" sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
                        <div className="content-header">
                            <h3>Modificar huella</h3>
                            <p>Por favor, coloque la huella en el lector y pulse "Iniciar escaneo"</p>
                        </div>
                        <div className="loading-finger">
                            <img src={loadingFinger} alt="loadingFinger"/>
                        </div>
                    </MUILayout.Box>
                    <MUIButtons.LoadingButton disabled={selectedRoller} color="primary" onClick={startScan} loading={scanningFinger} loadingPosition="center" variant="outlined">
                        <span>Escanear huella</span>
                    </MUIButtons.LoadingButton>
                </MUILayout.Box>
            </MUIInputs.Modal>
            <MUIInputs.Modal open={openModalAdd} onClose={handleCloseAdd} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <MUILayout.Box sx={stylesModal}>
                    <MUILayout.Box component="form" sx={{   '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
                        <div className="content-header">
                            <h3>Añadir una nueva huella</h3>
                            <p>Por favor, coloque la huella en el lector y pulse "Iniciar escaneo"</p>
                        </div>
                        <div className="loading-finger">
                            <img src={loadingFinger} alt="loadingFinger"/>
                        </div>
                    </MUILayout.Box>
                    <MUIInputs.TextField onChange={setNewRoller} sx={{width: "60%",marginBottom: "20px"}} id="select-enrolador" select label="Enrolador">
                        <MUIInputs.MenuItem key="enrolador1" value="enrolador1">Oficina gerente</MUIInputs.MenuItem>
                        <MUIInputs.MenuItem key="enrolador2" value="enrolador2">Oficina director</MUIInputs.MenuItem>
                        <MUIInputs.MenuItem key="enrolador3" value="enrolador3">Acceso primer piso</MUIInputs.MenuItem>
                        <MUIInputs.MenuItem key="enrolador4" value="enrolador4">Acceso monitoreo</MUIInputs.MenuItem>
                        <MUIInputs.MenuItem key="enrolador5" value="enrolador5">Acceso comedor</MUIInputs.MenuItem>
                        <MUIInputs.MenuItem key="enrolador6" value="enrolador6">Acceso salida</MUIInputs.MenuItem>
                    </MUIInputs.TextField>
                    <MUIButtons.LoadingButton color="primary" onClick={startScan} loading={scanningFinger} loadingPosition="center" variant="outlined">
                        <span>Escanear huella</span>
                    </MUIButtons.LoadingButton>
                </MUILayout.Box>
            </MUIInputs.Modal>
            <div>
                <div className="usuarios">
                    <h4>Agrupamiento de accesos</h4>
                    <MUIInputs.TextField onChange={setNewGroup} sx={{width: "180px",marginBottom: "20px"}} id="select-grupo" select label="Grupo de usuarios">
                        {grupos.map((grupo)=><MUIInputs.MenuItem key={grupo} value={grupo}>{grupo}</MUIInputs.MenuItem>)}
                    </MUIInputs.TextField>
                </div>
                <div className="grupos">
                    <h4>Dispositivos</h4>
                    <MUIInputs.TextField onChange={setNewGroupAccess} sx={{width: "180px",marginBottom: "20px"}} id="select-grupo-acceso" select label="Grupo de acceso">
                        {gruposAcceso.map((grupo)=><MUIInputs.MenuItem key={grupo} value={grupo}>{grupo}</MUIInputs.MenuItem>)}
                    </MUIInputs.TextField>
                </div>
            </div>
            <div className="huellas">
                <h4>Huellas digitales</h4>
                <MUILayout.Box sx={{width:"500px",margin:"0 0 10px 0"}}>
                    <MUILayout.DataGrid
                    disableRowSelectionOnClick={true}
                        sx={{margin: "0",height: "300px"}}
                        loading={loading}
                        autoPageSize
                        rows={huellas}
                        columns={gridColumns}
                        localeText={MUILayout.esES.components.MuiDataGrid.defaultProps.localeText}
                        />
                    <MUIButtons.Button sx={{marginTop: "20px"}} onClick={addHuella} variant="outlined" startIcon={<MUIIcons.AddIcon/>}>Añadir huella</MUIButtons.Button>
                </MUILayout.Box>
            </div>
            <div className="Tarjetas">
                <h4>Tarjetas</h4>
                <MUILayout.Box sx={{width:"350px",margin:"0 0 10px 0"}}>
                    <MUILayout.DataGrid
                        disableRowSelectionOnClick={true}
                        sx={{margin: "0", height: "300px"}}
                        loading={loading}
                        rows={tarjetas}
                        columns={tarjetasColumns}
                        autoPageSize
                        localeText={MUILayout.esES.omponents.MuiDataGrid.defaultProps.localeText}
                    />
                </MUILayout.Box>
            </div>
        </div>
    )
}

export default AccesosTab;