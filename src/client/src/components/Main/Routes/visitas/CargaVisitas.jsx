import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import React, { useState } from 'react';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import '../../../../styles/styles.css';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import Visitante from './Visitante';
import StepThree from './Steps/StepThree';


const CargaVisitas = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [datosVisitante,setDatosVisitante] = useState({
        documento: 0,
        pasaporte: 0,
        apellido: '',
        nombre: '',
        sexo: '',
        observaciones: '',
        foto:''
    });
    const [visitantes,setVisitantes] = useState([]);
    const [destino,setDestino] = useState(null);
    const [autorizante,setAutorizante] = useState('');
    const [loading, setLoading] = useState(false);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleReset = () => {
        setActiveStep(0);
    };
    const steps = [
      {
        label: 'Destino de la visita',
        description: `Por favor, seleccione el destino y el autorizante de la visita`,
        component: <StepOne setDestino={setDestino} setAutorizante={setAutorizante}/>
      },
      {
        label: 'Datos del visitante',
        description: 'Complete los campos con los datos del visitante',
        component: <StepTwo datos={datosVisitante} setDatos={setDatosVisitante}/>
      },
      {
        label: 'Imprima el ticket de la visita',
        description: `Ya puede imprimir el ticket de la visita`,
        component: <StepThree datos={datosVisitante} setDatos={setDatosVisitante}/>
      },
    ];
  return (
    <>
      <div className='content-header'>
        <EmojiPeopleIcon fontSize='large' />
        <h3>Cargar visitas</h3>
      </div>
      <div className='carga-visitas-content'>
        <Box sx={{ width: '50%'}}>
          <Stepper activeStep={activeStep} orientation='vertical'>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel optional={index === 2 ? (<Typography variant='caption'>Ultimo paso: Imprima el ticket</Typography>) : null}>
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
                Se ha cargado correctamente la visita
              </Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Cargar otra visita
              </Button>
            </Paper>
          )}
        </Box>
        <div className='informacion-visita'>
            <h4>Información de visita</h4>
            {
              destino!==null ? 
              <div className='destino-visita'>
                <h4>{destino?.nombreDestino}</h4>
                <p>{destino?.detalleDestino}</p>
                <div className='telefono-destino'>
                  <LocalPhoneIcon/>
                  <span>{destino?.telefono}</span>
                </div>
                <div className='interno-destino'>
                  <LocalPhoneIcon/>
                  <span>{destino?.interno}</span>
                </div>
                <div className='autorizante-visita'>
                  <PersonIcon/>
                  <p>{autorizante?.nombreCompleto} - {autorizante?.cuil} - {autorizante?.estructura}</p>
                </div>
              </div>
              :
              <></>
            }
            <div className='lista-visitantes'>
              {
                visitantes.length > 0 ? <></> : <></>
              }
            </div>
        </div>
      </div>
    </>
  );
};

export default CargaVisitas;
