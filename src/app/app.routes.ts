import { Routes } from '@angular/router';
import { HomeComponent } from './pages/user/home/home.component';
import { SucursalSelecctionComponent } from './pages/user/sucursal-selecction/sucursal-selecction.component';
import { LayoutComponent } from './pages/user/layout/layout.component';
import { ProductsPageComponent } from './pages/user/products-page/products-page.component';
import { ProducDetailComponent } from './pages/user/produc-detail/produc-detail.component';
import { CategorypageComponent } from './pages/user/categorypage/categorypage.component';
import { CartpageComponent } from './pages/user/cartpage/cartpage.component';
import { NavbarsuperadminComponent } from './features/superadmin/components/navbarsuperadmin/navbarsuperadmin.component';
import { EmpresapageComponent } from './pages/superadmin/empresapage/empresapage.component';
import { SuperadminlayoutComponent } from './pages/superadmin/superadminlayout/superadminlayout.component';
import { NavbaradminempresaComponent } from './features/admin/components/navbaradminempresa/navbaradminempresa.component';
import { AdminempresalayoutComponent } from './pages/admin/adminempresalayout/adminempresalayout.component';
import { ProductosComponent } from './pages/admin/productos/productos.component';
import { CategoriasComponent } from './pages/admin/categorias/categorias.component';
import { SucursalAdminlayoutComponent } from './pages/sucursalAdmin/sucursal-adminlayout/sucursal-adminlayout.component';
import { MisproductosComponent } from './pages/sucursalAdmin/misproductos/misproductos.component';
import { SucursalesComponent } from './pages/admin/sucursales/sucursales.component';
import { UnidadesMedidaComponent } from './pages/admin/unidades-medida/unidades-medida.component';
import { LoginComponent } from './auth/login/login.component';
import { RoleGuardService } from './core/guards/role-guard.service';
import { MisventasComponent } from './pages/sucursalAdmin/misventas/misventas.component';
import { VentasanuladasComponent } from './pages/sucursalAdmin/ventasanuladas/ventasanuladas.component';
import { VentasconcretadasComponent } from './pages/sucursalAdmin/ventasconcretadas/ventasconcretadas.component';
import { GenerarpdfComponent } from './pages/sucursalAdmin/generarpdf/generarpdf.component';
import { ProveedoresComponent } from './pages/sucursalAdmin/proveedores/proveedores.component';
import { ComprasComponent } from './pages/sucursalAdmin/compras/compras.component';
import { MiscomprasComponent } from './pages/sucursalAdmin/miscompras/miscompras.component';
import { PagosComponent } from './pages/sucursalAdmin/pagos/pagos.component';
import { DashboardComponent } from './pages/sucursalAdmin/dashboard/dashboard.component';
import { RegistarUsuariosSucursalAdminComponent } from './pages/superadmin/registar-usuarios-sucursal-admin/registar-usuarios-sucursal-admin.component';
import { UsuariosucursaladminComponent } from './pages/admin/usuariosucursaladmin/usuariosucursaladmin.component';
import { RegisterComponent } from './auth/register/register.component';
export const routes: Routes = [
    //RUTAS DE USUARIO
    {path:'',component:HomeComponent},
    {path:'empresa/:idempresa',component:SucursalSelecctionComponent},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    
    {
        path:'empresa/:idempresa/sucursal/:idsucursal',
        component:LayoutComponent,
        children:[
            {path:'',component:ProductsPageComponent},
            {path:'producto/:idproducto',component:ProducDetailComponent},
            {path:'categoria/:idcategoria',component:CategorypageComponent},
            {path:'cart',component:CartpageComponent,
            canActivate: [RoleGuardService],
            data: { expectedRoles: ['USER'], }
            }
        ]
    },
   // RUTA PARA EL SUPERAADMIN
    {
        path: 'admin',
        component: SuperadminlayoutComponent, // Un componente layout para admin
        // canActivate: [AdminAuthGuard], // Guard para verificar si el usuario es administrador
        canActivate: [RoleGuardService],
        data: { expectedRoles: ['SUPERADMIN'] },
        children: [
            { path: 'empresas', component: EmpresapageComponent }, // Para super administrador
            {path:'usuarios',component:RegistarUsuariosSucursalAdminComponent}
        //     { path: 'empresa/:idempresa', component: AdminEmpresaDetailComponent, // Detalle de empresa para administrador de empresa
        //       children: [
        //         { path: 'sucursales', component: AdminSucursalesComponent }, // Lista de sucursales para administrador de empresa
        //         { path: 'sucursal/:idsucursal', component: AdminSucursalDetailComponent } // Detalle de sucursal para administrador de sucursal
        //       ]
        //     },
        //     // Otros componentes relacionados con la administración pueden ir aquí
        ]
    },
    //RUTA PARA EL ADMINISTRADOR DE EMPRESA
    {
        path: 'empresa/:idempresa/admin',
        component: AdminempresalayoutComponent, // Un componente layout para admin
        canActivate: [RoleGuardService],
         data: { expectedRoles: ['ADMIN'] },
        children: [
            { path: 'productos', component: ProductosComponent }, // Para administrador de empresa
            {path:'categorias',component:CategoriasComponent},
            {path:'sucursales',component:SucursalesComponent},
            {path:'unidadesmedida',component:UnidadesMedidaComponent},
            {path:'usuariosucursal',component:UsuariosucursaladminComponent}
        ]
    },
    {
        path:'empresa/:idempresa/sucursal/:idsucursal/admin',
        component:SucursalAdminlayoutComponent,
         canActivate: [RoleGuardService],
        data: { expectedRoles: ['ADMINSUCURSAL'] },
        children:[
            {path:'',component:DashboardComponent},
            {path:'dashboard',component:DashboardComponent},
            {path:'misproductos',component:MisproductosComponent},
            {path:'misventas',component:MisventasComponent},
            {path:'ventasanuladas',component:VentasanuladasComponent},
            {path:'ventasconcretadas',component:VentasconcretadasComponent},
            {path:'generar-pdf',component:GenerarpdfComponent},
            {path:'proveedores',component:ProveedoresComponent},
            {path:'compras',component:ComprasComponent},
            {path:'miscompras',component:MiscomprasComponent},
            {path:'pagos',component:PagosComponent}
        ]
    },
    // // Ruta de redirección para cualquier ruta no encontrada
    // { path: '**', redirectTo: '' }
];
