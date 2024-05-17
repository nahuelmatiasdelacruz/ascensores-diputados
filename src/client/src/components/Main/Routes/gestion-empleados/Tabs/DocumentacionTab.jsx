/* Normal imports */
import React, { useEffect, useState, useRef } from 'react';
import toast, {Toaster} from 'react-hot-toast';
import { stylesModal } from '../../../../../styles/customStyles';
import { server } from '../../../../../helpers/constants';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import axios from 'axios';
import UploadImage from '../../../../../img/uploadimg.jpg';
import { Document, Page, pdfjs } from 'react-pdf';

/* Material UI */
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';import { esES } from '@mui/x-data-grid/locales';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MenuItem from '@mui/material/MenuItem';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SyncIcon from '@mui/icons-material/Sync';
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentacionTab = ({userData}) => {
    const fileInputRef = useRef(null);
    const [loading,setLoading] = useState(false);
    const [openModalAdd,setOpenModalAdd] = useState(false);
    const [openEditar,setOpenEditar] = useState(false);
    const [selectedDoc,setSelectedDoc] = useState(null);
    const [documentaciones,setDocumentaciones] = useState(false);
    const [openBorrar,setOpenBorrar] = useState(false);
    const [modalTarjeta,setOpenModalTarjeta] = useState(false);
    const [datosDocumentacion,setDatosDocumentacion] = useState({});
    const [pdfFile,setPdfFile] = useState(null);
    const [pdfBlob,setPdfBlob] = useState(null);
    const [numPages,setNumPages] = useState(null);

    const gridColumns = [
        {field: 'descripcion', headerName: 'Descripción', width: 300},
        {field: 'ins_fecha', headerName: 'Fecha de carga', width: 200},
        {field: 'actions',disableColumnMenu: true,disableColumnFilter: true,disableColumnSelector: true,headerName: 'Acciones',sortable: false,width: 130,renderCell: (params)=>{
            return(
                <Stack direction='row' spacing={1}>
                    <IconButton onClick={(e)=>{verDocumentacion(e,params.row)}} color='secondary' aria-label='edit'>
                        <InsertDriveFileIcon/>
                    </IconButton>
                    <IconButton onClick={(e)=>{borrarDocumentacion(e,params.row)}} color='error' aria-label='delete'>
                        <DeleteIcon/>
                    </IconButton>
                </Stack>
            )
        }},
    ]
    const verDocumentacion = async (e,data) => {
        setLoading(true);
        try{
            const response = await axios.get(`${server}/api/docs/download/${data.id}`,{
                responseType: 'blob'
            });
            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = `documento_${userData.empleado_id}.pdf`;
            link.click();
        }catch(e){
            console.log(e);
        }
        setLoading(false);
    }
    const borrarDocumentacion = (e,data) => {
        setSelectedDoc(data.id);
        setOpenBorrar(true);
    }
    const confirmarBorrado = async () => {
        setLoading(true);
        try{
            const response = await axios.delete(`${server}/api/docs/${selectedDoc}`);
            setSelectedDoc(null);
            setLoading(false);
            setOpenBorrar(false);
            getDocumentacion();
        }catch(e){
            toast.error('Hubo un error al borrar el documento');
            setLoading(false);
            setSelectedDoc(null);
            setOpenBorrar(false);
        }
    }
    const handleChangeFecha =(e) => {
        setDatosDocumentacion({
            ...datosDocumentacion,
            fecha_carga: e.$d
        })
    }
    const formatDate = (date) => {
        const fechaFormateada = dayjs(date).format('DD-MM-YYYY');
        return fechaFormateada;
    }
    const handleCloseAdd = () => {
        setOpenModalAdd(false);
    }
    const handleCloseBorrar = () => {
        setSelectedDoc(null);
        setOpenBorrar(false);
    }
    const handleClickUpload = () => {
        fileInputRef.current.click();
    }
    const agregarDocumentacion = () => {
        setDatosDocumentacion({
            ...datosDocumentacion,
            fecha_carga: dayjs()
        })
        setOpenModalAdd(true);
    }
    const cancelarSeleccion = () => {
        setPdfFile(null);
        setOpenModalAdd(false);
    }
    const handleFileSelect = (e) => {
        if(e.target.files[0]){
            const file = e.target.files[0];
            setPdfBlob(file);
            setPdfFile(URL.createObjectURL(file));
        }else{
            return;
        }
    }
    const handleChangeObservaciones = (e) => {
        setDatosDocumentacion({
            ...datosDocumentacion,
            observaciones: e.target.value
        });
    }
    const confirmarArchivo = async () => {
        if(datosDocumentacion.observaciones === '' || datosDocumentacion.observaciones === undefined){
            return toast.error('Por favor, complete la descripción de la documentación');
        }
        if(!pdfFile){
            return toast.error('Seleccione un archivo para continuar');
        }
        try{
            const formData = new FormData();
            formData.append('pdfFile',pdfBlob,'archivo.pdf');
            formData.append('empleado_id',userData.empleado_id);
            formData.append('observaciones',datosDocumentacion.observaciones);
            formData.append('fecha_carga',dayjs(datosDocumentacion.fecha_carga).format('DD-MM-YYYY'));
            const response = await axios.post(`${server}/api/docs`,formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            await getDocumentacion();
            handleCloseAdd();
        }catch(e){
            console.log(e.message);
            toast.error(`Hubo un error al subir la documentación: \n${e.response}`);
        }
    }
    const getDocumentacion = async () => {
        setLoading(true);
        try{
            const result = await axios.get(`${server}/api/docs/${userData.empleado_id}`);
            const docs = result.data.map(doc=>{
                return {
                    ...doc,
                    ins_fecha: dayjs(doc.ins_fecha).format('DD-MM-YYYY')
                }
            });
            setDocumentaciones(docs);
        }catch(e){
            console.log(e.message);
        }
        setLoading(false);
    }
    useEffect(()=>{
        getDocumentacion();
    },[]);
    return(
        <div className='accesos-container'>
            <Toaster/>
            {/* Borrar Documento */}
            <Modal open={openBorrar} onClose={handleCloseBorrar} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={stylesModal}>
                    <h1 className='confirmation-text'>¿Confirma que desea borrar la documentación seleccionada?</h1>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={confirmarBorrado} color='success' variant='outlined'>Si</Button>
                        <Button onClick={handleCloseBorrar} color='error' variant='outlined'>No</Button>
                    </Stack>
                </Box>
            </Modal>
            {/* Añadir Documento */}
            <Modal open={openModalAdd} onClose={handleCloseAdd} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                <Box sx={{...stylesModal, width: '40%'}}>
                    <h1 className='confirmation-text'>Seleccione un archivo para subir: PDF</h1>
                    {
                        pdfFile ? <></> : <img style={{width: '30%', margin: 0}} src={UploadImage}/>
                    }
                    
                    {pdfFile && (
                      <div style={{borderRadius: '10px',boxShadow: '0px 0px 15px -3px rgba(0,0,0,0.1)',display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10,width: '70%', height: '400px', overflow: 'auto'}}>
                        <Document file={pdfFile}>
                          <Page width={500} renderAnnotationLayer={false} renderTextLayer={false} pageNumber={1}/>
                        </Document>
                      </div>
                    )}
                    <Button sx={{marginTop: '20px'}} onClick={handleClickUpload} variant='outlined' startIcon={<FileUploadIcon />}>
                        <input onChange={handleFileSelect} ref={fileInputRef} accept='application/pdf' style={{display: 'none'}} type='file'/>
                        {
                            pdfFile ? 'Cambiar archivo' : 'Seleccione un archivo'
                        }
                    </Button>
                    <DesktopDatePicker format='DD-MM-YYYY' sx={{marginTop: 4}} value={datosDocumentacion?.fecha_carga} onChange={handleChangeFecha} label='Fecha de carga'/>
                    <TextField value={datosDocumentacion.observaciones || ''} onChange={handleChangeObservaciones} size='small' sx={{marginTop: 5, marginBottom: 5, width: '80%'}} id='observaciones' label='Descripción del documento' variant='outlined' multiline type='text'/>
                    <Stack spacing={4} direction='row' justifyContent='center'>
                        <Button onClick={confirmarArchivo} color='success' variant='outlined'>Confirmar selección</Button>
                        <Button onClick={cancelarSeleccion} color='error' variant='outlined'>Cancelar</Button>
                    </Stack>
                </Box>
            </Modal>
            <Box sx={{width:'700px',margin:'0 0 10px 0', height: '400px'}}>
                <DataGrid
                    disableRowSelectionOnClick={true}
                    sx={{height: '80%'}}
                    loading={loading}
                    rows={documentaciones}
                    columns={gridColumns}
                    autoPageSize
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                />
                <Box sx={{marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'row', alignItems:'center',justifyContent:'space-between'}}>
                    <Button onClick={agregarDocumentacion} variant='outlined' startIcon={<AddIcon/>}>Agregar documentacion</Button>
                </Box>
            </Box>
        </div>
    )
}

export default DocumentacionTab;