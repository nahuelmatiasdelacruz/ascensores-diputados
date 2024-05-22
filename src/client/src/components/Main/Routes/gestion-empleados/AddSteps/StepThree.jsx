import React, { useState } from 'react';
import NoPhoto from '../../../../../img/nophoto.webp';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Webcam from 'react-webcam';
import { stylesModal } from '../../../../../styles/customStyles';

const StepThree = ({datos,setDatos}) => {
    const [foto,setFoto] = useState(null);
    const [imgSrc,setImgSrc] = useState(null);
    const webcamRef = React.useRef(null);
    const [webCamModal,setWebCamModal] = useState(false);
    const capture = React.useCallback(()=>{
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
      },[webcamRef, setImgSrc]);
    const handleFileSelect = (e) => {
        if(e.target.files[0]){
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const fotoUrl = URL.createObjectURL(file);
                setFoto(fotoUrl);
                const fotoBase64 = reader.result.split(',')[1];
                setDatos({
                    ...datos,
                    profilePhoto: fotoBase64
                });
            }
        }else{
            return;
        }
    }
    const startWebcamSync = () => {
        setWebCamModal(true);
      }
    const confirmarFotoCapturada = () => {
        if(imgSrc){
          const base64 = imgSrc.split(',')[1];
          setDatos({
            ...datos,
            profilePhoto: base64
          });
          setImgSrc(null);
          setWebCamModal(false);
        }
    }
    const handleCloseWebCamModal = () => {
        setImgSrc(null);
        setWebCamModal(false);
    }
    return(
        <Box sx={{width: '30%', display: 'flex',flexDirection: 'row', marginTop: 3, marginBottom: 3}}>
            <Modal open={webCamModal} onClose={handleCloseWebCamModal}>
                <Box sx={{...stylesModal,width: '40%', height: '70%'}}>
                  {imgSrc ? 
                    <React.Fragment>
                      <img src={imgSrc} alt='captured'/>
                      <Stack sx={{marginTop: 4}} direction='row' spacing={1}>
                        <Button onClick={()=>{setImgSrc(null)}} startIcon={<PhotoCamera/>} variant='outlined'>Capturar nuevamente</Button>
                        <Button onClick={confirmarFotoCapturada}  variant='outlined' color='success'>Confirmar foto</Button>
                      </Stack>
                    </React.Fragment>
                    :
                    <React.Fragment>
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat='image/png'
                        width={600}
                      />
                      <Button onClick={capture} sx={{marginTop: 4}} startIcon={<PhotoCamera/>} variant='outlined'>Capturar</Button>
                    </React.Fragment>
                }
                </Box>
            </Modal>
            <img className='foto-perfil' src={datos?.profilePhoto ? `data:image/png;base64,${datos.profilePhoto}` : NoPhoto} alt='No hay foto'/>
            <div className='step-two-buttons'>
                <Tooltip title='Subir foto'>
                    <IconButton color='primary' aria-label='upload picture' component='label'>
                        <input hidden accept='image/*' type='file' onChange={handleFileSelect}/>
                        <FileUploadIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title='Tomar foto'>
                    <IconButton onClick={startWebcamSync}>
                        <PhotoCamera color='secondary'/>
                    </IconButton>
                </Tooltip>
            </div>
        </Box>
    )
}

export default StepThree;