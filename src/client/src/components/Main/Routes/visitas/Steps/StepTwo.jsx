import React, { useState } from "react";
import NoPhoto from "../../../../../img/nophoto.png";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { InputLabel } from "@mui/material";

const StepTwo = ({datos,setDatos}) => {
    const [cargaAutomatica,setCargaAutomatica] = useState(false);
    const [foto,setFoto] = useState(null);
    const handleFileSelect = (e) => {
        if(e.target.files[0]){
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const fotoUrl = URL.createObjectURL(file);
                setFoto(fotoUrl);
                const fotoBase64 = reader.result.split(',')[1];
                setDatos({...datos, foto: fotoBase64});
            }
        }else{
            return;
        }
    }
    return(
        <div className="step">
            <div className="tipo-carga">
                <h4>Carga de datos: <span className={cargaAutomatica ? "auto" : "manual"}>{cargaAutomatica ? "Automatica (Escanear)" : "Manual"}</span></h4>
                <Switch checked={cargaAutomatica} onClick={()=>{setCargaAutomatica(!cargaAutomatica)}}/>
            </div>
            <div className="step-two-foto">
                <img className="foto-perfil" src={foto || NoPhoto} alt="No hay foto"/>
                <div className="step-two-buttons">
                    <Tooltip title="Subir foto">
                        <IconButton color="primary" aria-label="upload picture" component="label">
                            <input hidden accept="image/*" type="file" onChange={handleFileSelect}/>
                            <FileUploadIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Tomar foto">
                        <IconButton>
                            <PhotoCamera color="secondary"/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className="step-two-datos">
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },marginTop:3}} autoComplete="off">
                    <TextField disabled={cargaAutomatica} size="small" id="nombre" label="Nombre" variant="outlined"/>
                    <TextField disabled={cargaAutomatica} size="small" id="apellido" label="Apellido" variant="outlined"/>
                </Box>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },marginTop:3}} autoComplete="off">
                    <TextField disabled={cargaAutomatica} size="small" id="sexo" select label="Sexo" defaultValue="masculino">
                        <MenuItem key="masculino" value="masculino">Masculino</MenuItem>
                        <MenuItem key="femenino" value="femenino">Femenino</MenuItem>
                        <MenuItem key="nobinario" value="nobinario">No binario</MenuItem>
                    </TextField>
                </Box>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },marginTop:3}} autoComplete="off">
                      <TextField disabled={cargaAutomatica} type="number" size="small" id="nombre" label="Documento" variant="outlined"/>
                      <TextField disabled={cargaAutomatica} type="number" size="small" id="apellido" label="Pasaporte" variant="outlined"/>
                </Box>
                <Box component="form"sx={{'& .MuiTextField-root': { m: 1, width: '51.5ch' },}} noValidate autoComplete="off">
                    <TextField id="outlined-multiline-flexible" label="Observaciones" multiline maxRows={4}/>
                </Box>
            </div>
        </div>
    )
}

export default StepTwo;