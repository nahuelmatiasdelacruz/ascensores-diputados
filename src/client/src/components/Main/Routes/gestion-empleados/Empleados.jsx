import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import 'dayjs/locale/es';
import { GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  Stack,
  Chip, 
  IconButton, 
  EditIcon, 
  DeleteIcon, 
  MenuItem, PeopleIcon, PersonAddIcon, Modal, Box, Stepper, Step, StepLabel, Typography, StepContent, Button, Paper, FormControl, OutlinedInput, InputAdornment, SearchIcon, DataGrid, esES, SyncIcon, AddIcon, ToggleButtonGroup, ToggleButton } from '../../../';
import { stylesModal } from '../../../../styles/customStyles';
import TabsContainer from './Tabs/TabsContainer';
import axios from 'axios';
import loadingCircle from '../../../../img/loadingCircle.webp';
import { server } from '../../../../helpers/constants';
import StepOne from './AddSteps/StepOne';
import StepTwo from './AddSteps/StepTwo';
import StepThree from './AddSteps/StepThree';

export const Empleados = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading,setLoading] = useState(false);
    const [selected,setSelected] = useState({});
    const [datosNuevoEmpleado,setDatosNuevoEmpleado] = useState({
        documento_tipo_id: 1,
        sexo_id: 1,
        habilitacion: {
            p_turno_noche: false
        }
    });
    const [employeePhoto,setEmployeePhoto] = useState(null);
    const [modalBorrar,setOpenModalBorrar] = useState(false);
    const [modalAdd,setModalAdd] = useState(false);
    const [modalEditar,setOpenModalEditar] = useState(false);
    const [loadingExcel,setLoadingExcel] = useState(false);
    const [modalLoading,setModalLoading] = useState(false);
    const [loadingSync,setLoadingSync] = useState(false);
    const [empleados,setEmpleados] = useState([]);
    const [empleadosFiltrados,setEmpleadosFiltrados] = useState([]);
    const [filtroGeneral,setFiltroGeneral] = useState('');
    const [filtro,setFiltro] = useState('ACTIVO');
    const [modalConfirmarSalir,setModalConfirmarSalir] = useState(false);
    const handleChangeFiltro = async (e,nuevoFiltro) => {
        setFiltro(nuevoFiltro);
    }
    const checkEmptyStepOne = () => {
        if(datosNuevoEmpleado.nombre === '' || datosNuevoEmpleado.apellido === '' || datosNuevoEmpleado.documento === '' || datosNuevoEmpleado.nombre === undefined || datosNuevoEmpleado.apellido === undefined || datosNuevoEmpleado.documento === undefined){
            return false;
        }else{
            return true;
        }
    }
    const checkEmptyStepTwo = () => {
        if(datosNuevoEmpleado.habilitacion && 
            datosNuevoEmpleado.habilitacion.fechaDesde && 
            datosNuevoEmpleado.habilitacion.tipo && 
            datosNuevoEmpleado.habilitacion.sector){
                return true;
            }else{
                return false;
            }
    }
    const handleNext = async () => {
        if(activeStep === 0){
            const stepOne = checkEmptyStepOne();
            if(!stepOne){
                toast.error('Los campos \nNOMBRE, \nAPELLIDO, \nDOCUMENTO, \nTIPO, \nSEXO son obligatorios');
                return;
            }
        }
        if(activeStep === 1){
            const stepThree = checkEmptyStepTwo();
            if(!stepThree){
                toast.error('Complete los cambios de habilitación obligatorios:\n \nFecha inicio\nTipo\nSector');
                return;
            }
        }
        if(activeStep===2){
            const result = await confirmAdd();
            if(!result){
                return;
            }
            getNewEmpleado(result.id);
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleReset = () => {
        setDatosNuevoEmpleado({
            documento_tipo_id: 1,
            sexo_id: 1,
        })
        setActiveStep(0);
    };
    const getNewEmpleado = async (id) => {
        const empleadoData = await axios.get(`${server}/api/empleados/${id}`);
        const data = {
            ...empleadoData.data,
            id: empleadoData.data.empleado_id
        }
        handleCloseAdd();
        editarEmpleado(data);
    }
    const confirmAdd = async() => {
        try{
            const result = await axios.post(server+'/api/empleados',datosNuevoEmpleado);
            toast.success(`Se ha agregado correctamente al empleado: ${datosNuevoEmpleado.nombre} ${datosNuevoEmpleado.apellido}`);
            setDatosNuevoEmpleado({
                tipo_doc: 1,
                sexo_id: 1,
            });
            await getEmpleadosFiltrados('ACTIVO');
            return {
                id: result.data.id
            };
        }catch(e){
            toast.error(`No se ha podido agregar al empleado: \n${e.response.data.msg}`);
            return false;
        }
    }
    const addEmpleado = () => {
        setModalAdd(true);
    }
    const handleCloseAdd = () => {
        setModalAdd(false);
        handleReset();
    }
    const editarEmpleado = async (data) => {
        setModalLoading(true);
        const photo = await axios.get(`${server}/api/empleados/facial/${data.empleado_id}`);
        if(photo.data.length === 0){
            setSelected({
                ...data,
                profilePhoto: null
            });
        }else{
            setSelected({
                ...data,
                profilePhoto: JSON.parse(photo.data[0].template)
            })
        }
        setModalLoading(false);
        setOpenModalEditar(true);
    }
    const borrarEmpleado = (data) => {
        setSelected(data);
        setOpenModalBorrar(true);
    }
    const confirmarBorrado = async () => {
        try{
            await axios.delete(`${server}/api/habilitaciones/inhabilitar/${selected.empleado_id}`);
            await getEmpleadosFiltrados(filtro);
            setSelected({});
            setOpenModalBorrar(false);
            toast.success('Se ha borrado el empleado correctamente');
        }catch(e){
            toast.error(`Hubo un error al borrar el empleado: ${e.message}`);
        }
    }
    const handleCloseBorrar = () => {
        setOpenModalBorrar(false);
    }
    const handleCloseEditar = async () => {
        getEmpleadosFiltrados(filtro);
        setSelected({});
        setOpenModalEditar(false);
    }
    const getColor = (estado) => {
        switch(estado){
            case 'ACTIVO':
                return 'success';
            case 'PRECARGA':
                return 'warning';
            case 'INACTIVO':
                return 'error';
            default:
                return 'primary';
        }
    }
    const steps = [
        {
          label: 'Datos básicos',
          description: `Por favor, complete los datos básicos del nuevo empleado`,
          component: <StepOne datos={datosNuevoEmpleado} setDatos={setDatosNuevoEmpleado}/>
        },
        {
          label: 'Habilitación',
          description: 'Complete la información para habilitar al empleado',
          component: <StepTwo datos={datosNuevoEmpleado} setDatos={setDatosNuevoEmpleado}/>
        },
        {
          label: 'Foto de perfil',
          description: `Para finalizar, seleccione una foto de perfil. Recuerde que la foto podrá ser utilizada si lo desea, como identificador facial`,
          component: <StepThree datos={datosNuevoEmpleado} setDatos={setDatosNuevoEmpleado}/>
        },
    ];
    const gridColumns = [
        {field: 'documento', headerName: 'Documento', width: 130},
        {field: 'apellido',headerName:'Apellido', width: 200},
        {field: 'nombre',headerName: 'Nombre', width: 200},
        {field: 'periodo_legislativo', headerName: 'Periodo', width: 120},
        {field: 'habilitacion_tipo', headerName: 'Tipo', width: 250},
        {field: 'sector', headerName: 'Estructura', width: 320},
        {field: 'cantidad_datos_bio', headerName: 'Huellas', width: 140, renderCell: (params)=>{
             if(params.row.cantidad_datos_bio === '0'){
                return 'SIN DATOS';
             }else{
                return params.row.cantidad_datos_bio;
             }
        }},
        {field: 'estado', disableColumnFilter: false, disableColumnMenu: false, headerName: 'Estado',renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <Chip label={params.row.estado} color={getColor(params.row.estado)} size='small'/>
                </Stack>
            )
        },valueGetter: (params)=>params.row.estado, sortable: true},
        {field: 'actions',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{
                        e.stopPropagation();
                        editarEmpleado(params.row)}} color='success' aria-label='edit'>
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{
                        e.stopPropagation();
                        borrarEmpleado(params.row)}} color='error' aria-label='delete'>
                    <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const getEmpleadosFiltrados = async (estado) => {
        setLoading(true);
        const empleados = await axios.get(`${server}/api/empleados/filtrados/${estado}`);
        setEmpleados(empleados.data);
        setEmpleadosFiltrados(empleados.data);
        setLoading(false);
    }
    const handleCloseModalLoading = () => {
        setModalLoading(false);
    }
    const editarEmpleadoRow = (params) => {
        editarEmpleado(params.row);
    }
    const syncAll = async () => {
        setLoadingSync(true);
        try{
            await axios.post(`${server}/api/huellas/syncall`);
            toast.success('Ha comenzado la sincronización de dispositivos, aguarde unos minutos para ver los cambios');
            setLoadingSync(false);
        }catch(e){
            toast.error(`Hubo un error al sincronizar los usuarios y dispositivos: \n\n${e.message}`);
            setLoadingSync(false);
        }
    }
    const handleChangeAllFilter = (e) => {
        setFiltroGeneral(e.target.value);
    }
    const handleCloseConfirmarSalir = () => {
        setModalConfirmarSalir(false);
    }
    const askIfExit = () => {
        setModalConfirmarSalir(true);
    }
    const downloadExcel = (employes) => {
        setLoadingExcel(true);
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(employes);
        XLSX.utils.book_append_sheet(workbook, worksheet, `Empleados`);
        const nombreArchivo = `empleados.xlsx`;
        XLSX.writeFile(workbook, nombreArchivo);
        setLoadingExcel(false);
    }
    const getExcel = (apiRef) => {
        const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
        const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);
        const data = filteredSortedRowIds.map((id) => {
          const row = {};
          visibleColumnsField.forEach((field) => {
            row[field] = apiRef.current.getCellParams(id, field).value;
          });
          return row;
        });
        const parsedToDownload = data.map((emp)=>{
            return {
                DOCUMENTO: emp.documento,
                APELLIDO: emp.apellido,
                NOMBRE: emp.nombre,
                TIPO_DE_USUARIO: emp.habilitacion_tipo,
                CANTIDAD_DATOS_BIO: emp.cantidad_datos_bio,
                ESTRUCTURA: emp.sector,
                ESTADO: emp.estado
            }
        });
        downloadExcel(parsedToDownload);
    };
    function ExcelExportMenuItem(props) {
        const apiRef = useGridApiContext();
        const { hideMenu } = props;
        return (
          <MenuItem
            onClick={() => {
              getExcel(apiRef);
              hideMenu?.();
            }}
          >
            Exportar EXCEL
          </MenuItem>
        );
    }
    const csvOptions = { delimiter: ';' };
    function CustomExportButton(props) {
      return (
        <GridToolbarExportContainer {...props}>
          <GridCsvExportMenuItem options={csvOptions} />
          <ExcelExportMenuItem/>
        </GridToolbarExportContainer>
      );
    }
    function CustomToolbar(props) {
      return (
        <GridToolbarContainer {...props}>
          <CustomExportButton />
        </GridToolbarContainer>
      );
    }
    useEffect(()=>{
        getEmpleadosFiltrados(filtro);
    },[filtro]);
    useEffect(()=>{
        if(filtroGeneral!==''){
            const filtrados = empleados.filter((empleado)=>{
                const {nombre, apellido, documento} = empleado;
                const filtroMinusculas = filtroGeneral.toLowerCase();
                const validName = nombre && nombre.toLowerCase().includes(filtroMinusculas);
                const validApellido = apellido && apellido.toLowerCase().includes(filtroMinusculas);
                const documentoValido = documento && documento.includes(filtroGeneral);
                return validName || validApellido || documentoValido;
            })
            setEmpleadosFiltrados(filtrados);
        }else{
            getEmpleadosFiltrados(filtro);
        }
    },[filtroGeneral]);
    return(
        <>
            <Toaster/>
            <div className='content-header'>
                <PeopleIcon sx={{fontSize: 40}}/>
                <h3>Empleados</h3>
            </div>
            <Modal open={modalConfirmarSalir} onClose={handleCloseConfirmarSalir}>
                <Box sx={{...stylesModal,width: '40%'}}>
                    <h4 className='info-title'>¿Desea cancelar el agregado del nuevo empleado? Se perderan todos los cambios</h4>
                    <Stack direction='row' spacing={5} marginTop='30px' justifyContent='center'>
                        <Button onClick={()=>{
                            handleCloseConfirmarSalir();
                            handleCloseAdd();
                        }} variant='outlined' color='success'>Si</Button>
                        <Button onClick={handleCloseConfirmarSalir} variant='outlined' color='error'>No</Button>
                    </Stack>
                </Box>
            </Modal>

            {/* Añadir empleado */}
            <Modal open={modalAdd} onClose={askIfExit} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={{...stylesModal,width: '50%'}}>
                    <Box sx={{display: 'flex',alignItems: 'center', width: '20%',justifyContent: 'space-around'}}>
                        <PersonAddIcon fontSize='large' color='primary'/>
                        <h4 style={{color: '#1282a2ff'}}>Nuevo empleado</h4>
                    </Box>
                    <Box sx={{ width: '98%'}}>
                      <Stepper activeStep={activeStep} orientation='vertical'>
                        {steps.map((step, index) => (
                          <Step key={step.label}>
                            <StepLabel optional={index === 2 ? (<Typography variant='caption'>Ultimo paso: Cargue la foto de perfil</Typography>) : null}>
                              {step.label}
                            </StepLabel>
                            <StepContent>
                              {step.component}
                              <Box sx={{ mb: 2 }}>
                                <div>
                                  <Button variant='outlined' onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                                    {index === steps.length - 1 ? 'Finalizar' : 'Continuar'}
                                  </Button>
                                  <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>Volver</Button>
                                </div>
                              </Box>
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                      {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                          <Typography>
                            Se ha cargado correctamente el empleado
                          </Typography>
                          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                            Cargar otro empleado
                          </Button>
                        </Paper>
                      )}
                    </Box>
                </Box>
            </Modal>

            {/* Borrar empleado */}
            <Modal open={modalBorrar} onClose={handleCloseBorrar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={{...stylesModal,width: '30%'}}>
                    <Box sx={{display: 'flex',alignItems: 'center', width: '100%',justifyContent: 'space-around'}}>
                        <h4 style={{color: '#1282a2ff'}}>¿Está seguro que desea inhabilitar el empleado {selected?.nombre} {selected?.apellido}?</h4>
                    </Box>
                    <Box sx={{ width: '98%'}}>
                        <Stack direction='row' spacing={5} marginTop='30px' justifyContent='center'>
                            <Button onClick={confirmarBorrado} color='success' variant='outlined'>Confirmar</Button>
                            <Button onClick={handleCloseBorrar} color='error' variant='outlined'>Cancelar</Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

             {/* Editar empleado */}
            <Modal open={modalEditar} onClose={handleCloseEditar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <React.Fragment>
                    <TabsContainer handleCloseEditar={handleCloseEditar} setData={setSelected} data={selected}/>
                </React.Fragment>
            </Modal>
            <Modal open={modalLoading} onClose={handleCloseModalLoading}>
                <Box sx={stylesModal}>
                    <img style={{width: '60%'}}src={loadingCircle} alt='Cargando...'/>
                </Box>
            </Modal>
            <FormControl sx={{width: '25ch', marginBottom: '15px' }}>
              <OutlinedInput size='small' placeholder='Buscar..' id='filled-adornment-password' type='text' onChange={handleChangeAllFilter}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton disabled edge='end'>
                        <SearchIcon/>
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <DataGrid
                slots={{toolbar: CustomToolbar}}
                disableRowSelectionOnClick={true}
                onRowClick={editarEmpleadoRow}
                sx={{height: '70%'}}
                loading={loading}
                rows={empleadosFiltrados}
                columns={gridColumns}
                autoPageSize
                rowHeight={55}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
            <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px'}}>
                <Button onClick={addEmpleado} variant='outlined' startIcon={<AddIcon/>}>Añadir empleado</Button>
                <Box>
                    <ToggleButtonGroup disabled={loading} size='small' value={filtro} exclusive onChange={handleChangeFiltro} aria-label='Filtro'>
                      <ToggleButton color='success' value='ACTIVO'>Activos</ToggleButton>
                      <ToggleButton color='error' value='INACTIVO'>Inactivos</ToggleButton>
                      <ToggleButton color='warning' value='PRECARGA'>Precarga</ToggleButton>
                      <ToggleButton color='primary' value='ALL'>Todos</ToggleButton>
                    </ToggleButtonGroup>
                    <Button onClick={syncAll} disabled={loadingSync} sx={{marginLeft: '25px'}} startIcon={<SyncIcon/>} variant='contained' color='secondary'>Sync</Button>
                </Box>
            </Box>
        </>
    )
};