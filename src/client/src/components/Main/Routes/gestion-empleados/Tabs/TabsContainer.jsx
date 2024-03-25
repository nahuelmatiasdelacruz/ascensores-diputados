import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UserPhoto from "../../../../../img/nophoto.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SyncIcon from "@mui/icons-material/Sync";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Webcam from "react-webcam";
import { useState } from "react";
import AccesosTab from "./AccesosTab";
import EventosTab from "./EventosTab";
import DetallesTab from "./DetallesTab";
import IdentificacionesTab from "./IdentificacionesTab";
import axios from "axios";
import { server } from "../../../../../helpers/constants";
import DocumentacionTab from "./DocumentacionTab";
import HabilitacionesTab from "./HabilitacionesTab";
import { stylesModal } from "../../../../../styles/customStyles";
import { Toaster, toast } from "react-hot-toast";

function TabPanel(props) {
    const { data, children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
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
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function TabsContainer({ setData, data, handleCloseEditar }) {
    const inputFile = React.useRef(null);
    const onFileClick = () => {
        inputFile.current.click();
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const webcamRef = React.useRef(null);
    const [webCamModal, setWebCamModal] = useState(false);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [value, setValue] = useState(0);
    const [userData, setUserData] = useState(data);
    const [loading, setLoading] = useState(false);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef, setImgSrc]);

    const handleCloseWebCamModal = () => {
        setImgSrc(null);
        setWebCamModal(false);
    };
    const startWebcamSync = () => {
        setWebCamModal(true);
    };
    const confirmarFotoCapturada = async () => {
        if (imgSrc) {
            const base64 = imgSrc.split(",")[1];
            setData({
                ...data,
                profilePhoto: base64,
            });
            try {
                await axios.post(`${server}/api/empleados/changePhoto`, {
                    foto: base64,
                    userId: data.empleado_id,
                });
                setImgSrc(null);
                setWebCamModal(false);
                toast.success("Se ha cambiado con éxito la foto");
            } catch (e) {
                setImgSrc(null);
                setWebCamModal(false);
                toast.error("Hubo un error al cambiar la foto");
            }
        }
    };
    const handlePhotoSelect = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const fotoBase64 = reader.result.split(",")[1];
                setData({
                    ...data,
                    profilePhoto: fotoBase64,
                });
                await axios.post(`${server}/api/empleados/changePhoto`, {
                    foto: fotoBase64,
                    userId: data.empleado_id,
                });
            };
        } else {
            return;
        }
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const confirmarCambios = async () => {
        try {
            const result = await axios.put(
                `${server}/api/empleados/`,
                userData
            );
            toast.success("Se ha actualizado correctamente el empleado");
        } catch (e) {
            console.log(e);
            toast.error("Hubo un error al actualizar los datos del empleado");
        }
    };
    const handleSync = async () => {
        setLoading(true);
        try {
            await axios.get(
                `${server}/api/huellas/sync/${userData.empleado_id}`
            );
            setLoading(false);
            toast.success("Sincronización de huellas en equipos COMPLETADA");
        } catch (e) {
            setLoading(false);
            toast.error(
                `No se pudo sincronizar los dispositivos: \n${e.message}`
            );
        }
    };
    const getColor = (estado) => {
        switch (estado) {
            case "ACTIVO":
                return "success";
            case "INACTIVO":
                return "error";
            case "PRECARGA":
                return "warning";
            default:
                return "primary";
        }
    };
    const updateUserData = async () => {
        try {
            const currentPhoto = data.profilePhoto;
            const empleado = await axios.get(
                `${server}/api/empleados/${data.empleado_id}`
            );
            const newData = {
                ...empleado.data,
                profilePhoto: currentPhoto,
            };
            setUserData(newData);
        } catch (e) {
            toast.error("Hubo un error al refrescar los datos del empleado");
        }
    };
    return (
        <Box
            sx={{
                width: "90%",
                backgroundColor: "white",
                margin: "0 auto",
                marginTop: "30px",
                boxSizing: "border-box",
                padding: "20px",
                borderRadius: "6px",
            }}>
            <Toaster />
            <Modal open={webCamModal} onClose={handleCloseWebCamModal}>
                <Box sx={{ ...stylesModal, width: "40%", height: "70%" }}>
                    {imgSrc ? (
                        <React.Fragment>
                            <img src={imgSrc} alt="captured" />
                            <Stack
                                sx={{ marginTop: 4 }}
                                direction="row"
                                spacing={1}>
                                <Button
                                    onClick={() => {
                                        setImgSrc(null);
                                    }}
                                    startIcon={<PhotoCamera />}
                                    variant="outlined">
                                    Capturar nuevamente
                                </Button>
                                <Button
                                    onClick={confirmarFotoCapturada}
                                    variant="outlined"
                                    color="success">
                                    Confirmar foto
                                </Button>
                            </Stack>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Webcam
                                ref={webcamRef}
                                screenshotFormat="image/png"
                                width={600}
                            />
                            <Button
                                onClick={capture}
                                sx={{ marginTop: 4 }}
                                startIcon={<PhotoCamera />}
                                variant="outlined">
                                Capturar
                            </Button>
                        </React.Fragment>
                    )}
                </Box>
            </Modal>
            <div className="profile-data-header">
                <div className="profile-photo-data">
                    <div className="profile-photo-container">
                        <img
                            src={
                                data.profilePhoto !== null
                                    ? `data:image/png;base64,${data.profilePhoto}`
                                    : UserPhoto
                            }
                            alt="profile photo"
                        />
                    </div>
                    <div className="button-upload-container">
                        <IconButton
                            aria-controls={open ? "basic-menu" : undefined}
                            className="upload-profile-button"
                            color="primary"
                            aria-label="upload picture"
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                            component="label">
                            <PhotoCamera />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}>
                            <MenuItem onClick={onFileClick}>
                                <input
                                    onChange={handlePhotoSelect}
                                    accept="image/*"
                                    type="file"
                                    ref={inputFile}
                                    style={{ display: "none" }}
                                />
                                Seleccionar archivo
                            </MenuItem>
                            <MenuItem onClick={startWebcamSync}>
                                WebCam
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className="profile-data">
                    <h4>
                        {userData.nombre} {userData.apellido}
                    </h4>
                    <p>
                        DNI: <span>{data.documento}</span>
                    </p>
                    <Stack direction="row" spacing={1}>
                        <Chip
                            label={userData.estado}
                            color={getColor(userData.estado)}
                            size="small"
                        />
                    </Stack>
                </div>
            </div>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="Editar">
                    <Tab label="Detalle de empleado" {...a11yProps(0)} />
                    <Tab label="Habilitaciones" {...a11yProps(1)} />
                    <Tab label="Accesos permitidos" {...a11yProps(2)} />
                    <Tab label="Identificaciones" {...a11yProps(3)} />
                    <Tab label="Marcaciones" {...a11yProps(4)} />
                    <Tab label="Documentacion" {...a11yProps(5)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <DetallesTab userData={userData} setUserData={setUserData}/>
                <Stack
                    direction="row"
                    spacing={5}
                    marginTop="30px"
                    justifyContent="center">
                    <Button
                        onClick={confirmarCambios}
                        color="success"
                        variant="outlined">
                        Confirmar cambios
                    </Button>
                    <Button
                        onClick={handleCloseEditar}
                        color="error"
                        variant="outlined">
                        Salir
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <HabilitacionesTab
                    updateData={updateUserData}
                    userData={userData}
                />
                <Stack
                    direction="row"
                    spacing={5}
                    marginTop="30px"
                    justifyContent="center">
                    <Button
                        onClick={handleCloseEditar}
                        color="error"
                        variant="outlined">
                        Salir
                    </Button>
                    <Button
                        onClick={handleSync}
                        disabled={loading}
                        variant="contained"
                        startIcon={<SyncIcon />}>
                        Sincronizar
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <AccesosTab userData={userData} />
                <Stack
                    direction="row"
                    spacing={5}
                    marginTop="30px"
                    justifyContent="center">
                    <Button
                        onClick={handleCloseEditar}
                        color="error"
                        variant="outlined">
                        Salir
                    </Button>
                    <Button
                        onClick={handleSync}
                        disabled={loading}
                        variant="contained"
                        startIcon={<SyncIcon />}>
                        Sincronizar
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <IdentificacionesTab userData={userData} />
                <Stack
                    direction="row"
                    spacing={5}
                    marginTop="30px"
                    justifyContent="center">
                    <Button
                        onClick={handleCloseEditar}
                        color="error"
                        variant="outlined">
                        Salir
                    </Button>
                    <Button
                        onClick={handleSync}
                        disabled={loading}
                        variant="contained"
                        startIcon={<SyncIcon />}>
                        Sincronizar
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={4}>
                <EventosTab userData={userData} />
                <Stack
                    direction="row"
                    spacing={5}
                    marginTop="30px"
                    justifyContent="center">
                    <Button
                        onClick={handleCloseEditar}
                        color="error"
                        variant="outlined">
                        Salir
                    </Button>
                </Stack>
            </TabPanel>
            <TabPanel value={value} index={5}>
                <DocumentacionTab userData={userData} />
                <Stack
                    direction="row"
                    spacing={5}
                    marginTop="30px"
                    justifyContent="center">
                    <Button
                        onClick={handleCloseEditar}
                        color="error"
                        variant="outlined">
                        Salir
                    </Button>
                </Stack>
            </TabPanel>
        </Box>
    );
}
