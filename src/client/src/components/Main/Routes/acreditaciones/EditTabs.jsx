import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import UserPhoto from '../../../../img/no-profile2.webp';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {AcreditacionTab,HabilitacionesTab,DocumentacionesTab,BienesTab,AscensoresTab,AccesosTab,EventosTab} from './Tabs';

function TabPanel(props) {
  const { data, children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function EditTabs({data}) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '80%', backgroundColor: 'white', margin: '0 auto', marginTop: '30px', boxSizing: 'border-box', padding: '20px',borderRadius: '6px'}}>
      <div className='profile-data-header'>
        <div className='profile-photo-container'>
          <img src={UserPhoto} alt='profile photo'/>
          <div className='button-upload-container'>
            <IconButton className='upload-profile-button' color='primary' aria-label='upload picture' component='label'>
              <input hidden accept='image/*' type='file'/>
              <PhotoCamera />
            </IconButton>
          </div>
        </div>
        <div className='profile-data'>
          <h4>{data.apellidoNombre}</h4>
          <p>{data.empresaOrganismo}</p>
          <p>DNI: <span>{data.documento}</span></p>
        </div>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label='Editar'>
          <Tab label='Acreditacion' {...a11yProps(0)} />
          <Tab label='Habilitaciones' {...a11yProps(1)} />
          <Tab label='Documentación' {...a11yProps(2)} />
          <Tab label='Bienes personales' {...a11yProps(3)} />
          <Tab label='Huellas dactilares' {...a11yProps(4)} />
          <Tab label='Accesos' {...a11yProps(5)} />
          <Tab label='Eventos' {...a11yProps(6)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AcreditacionTab/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HabilitacionesTab/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DocumentacionesTab/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <BienesTab/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <AscensoresTab/>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <AccesosTab/>
      </TabPanel>
      <TabPanel value={value} index={6}>
        <EventosTab/>
      </TabPanel>
    </Box>
  );
}