import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteManager from "./components/Main/Routes/RouteManager";
import Main from './components/Main/Main';
import Login from './components/Login/Login';
import Index from './components/Main/Routes';

function App() {
  const [isLoggedIn,setLoggedIn] = useState(false);
  useEffect(()=>{
    const token = sessionStorage.getItem("token");
    if(token){
      setLoggedIn(true);
    }
  },[]);
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/login' element={<Login setLoggedIn={setLoggedIn}/>}/>
        <Route exact path='/' element={<Main isLoggedIn={isLoggedIn}/>}>
          <Route index element={<Index/>}/>
          {/* Acreditaciones */}
          <Route exact path="/acreditaciones/acreditaciones" element={<RouteManager.AcreditacionesRoutes.Acreditaciones/>}/>
          <Route exact path="/acreditaciones/tipos-habilitacion" element={<RouteManager.AcreditacionesRoutes.TiposHabilitacion/>}/>
          <Route exact path="/acreditaciones/tipos-bien" element={<RouteManager.AcreditacionesRoutes.TiposBien/>}/>
          <Route exact path="/acreditaciones/empresas-organismos" element={<RouteManager.AcreditacionesRoutes.EmpresasOrganismos/>}/>

          {/* Visitas */}
          <Route exact path="/visitas/carga-visitas" element={<RouteManager.VisitasRoutes.CargaVisitas/>}/>
          <Route exact path="/visitas/registro-visitas" element={<RouteManager.VisitasRoutes.RegistroVisitas/>}/>

          {/* Dispositivos */}
          <Route exact path="/equipos/grupos" element={<RouteManager.DispositivosRoutes.Grupos/>}/>
          <Route exact path="/equipos" element={<RouteManager.DispositivosRoutes.Dispositivos/>}/>
          <Route exact path="/equipos/marcaciones" element={<RouteManager.DispositivosRoutes.Marcaciones/>}/>

          {/* Empleados */}
          <Route exact path="/gestion-empleados/empleados" element={<RouteManager.GestionEmpRoutes.Empleados/>}/>
          <Route exact path="/gestion-empleados/credenciales" element={<RouteManager.GestionEmpRoutes.Credenciales/>}/>
          <Route exact path="/gestion-empleados/tipos-credencial" element={<RouteManager.GestionEmpRoutes.TiposCredencial/>}/>
          <Route exact path="/gestion-empleados/firmas" element={<RouteManager.GestionEmpRoutes.Firmas/>}/>

          {/* Configuracion */}
          <Route exact path="/configuracion/periodos" element={<RouteManager.ConfiguracionRoutes.Periodos/>}/>

          {/* Espacios físicos */}
          <Route exact path="/gestion-espacios/oficinas" element={<RouteManager.GestionEspRoutes.Oficinas/>}/>
          <Route exact path="/gestion-espacios/espacios" element={<RouteManager.GestionEspRoutes.Espacios/>}/>

          {/* Dispositivos */}
          <Route exact path="/molinetes/equipos" element={<RouteManager.MolinetesRoutes.Equipos/>}/>
          <Route exact path="/molinetes/enroladores" element={<RouteManager.MolinetesRoutes.Enroladores/>}/>

          {/* Visitas */}
          <Route exact path="/reportes-visitas" element={<RouteManager.ReportesVisitasRoutes.ReportesVisitas/>}/>

          {/* Usuarios */}
          <Route exact path="/administracion/permisos" element={<RouteManager.AdministracionRoutes.Permisos/>}/>
          <Route exact path="/administracion/roles" element={<RouteManager.AdministracionRoutes.Roles/>}/>
          <Route exact path="/administracion/usuarios" element={<RouteManager.AdministracionRoutes.Usuarios/>}/>
          <Route exact path="/administracion/errores" element={<RouteManager.AdministracionRoutes.Errores/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
