import AcreditacionesRoutes from './acreditaciones/RouterManager';
import AdministracionRoutes from './administracion/RouterManager';
import ConfiguracionRoutes from './Configuracion/ConfiguracionRoutes';
import DispositivosRoutes from './dispositivos/RouterManager';
import GestionEmpRoutes from './gestion-empleados/RouterManager';
import GestionEspRoutes from './gestion-espacios/RouterManager';
import MolinetesRoutes from './molinetes/RouterManager';
import ReportesVisitasRoutes from './reportes-visitas/RouterManager';
import VisitasRoutes from './visitas/RouterManager';

const RouteManager = {
    AcreditacionesRoutes,
    AdministracionRoutes,
    ConfiguracionRoutes,
    DispositivosRoutes,
    GestionEmpRoutes,
    GestionEspRoutes,
    MolinetesRoutes,
    ReportesVisitasRoutes,
    VisitasRoutes
}

export default RouteManager;