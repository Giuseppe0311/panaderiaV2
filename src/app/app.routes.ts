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
export const routes: Routes = [
    //RUTAS DE USUARIO
    {path:'',component:HomeComponent},
    {path:'empresa/:idempresa',component:SucursalSelecctionComponent},

    {
        path:'empresa/:idempresa/sucursal/:idsucursal',
        component:LayoutComponent,
        children:[
            {path:'',component:ProductsPageComponent},
            {path:'producto/:idproducto',component:ProducDetailComponent},
            {path:'categoria/:idcategoria',component:CategorypageComponent},
            {path:'cart',component:CartpageComponent},

        ]
    },
   // RUTA PARA EL SUPERAADMIN
    {
        path: 'admin',
        component: SuperadminlayoutComponent, // Un componente layout para admin
        // canActivate: [AdminAuthGuard], // Guard para verificar si el usuario es administrador
        children: [
            { path: 'empresas', component: EmpresapageComponent }, // Para super administrador
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
        // canActivate: [AdminAuthGuard], // Guard para verificar si el usuario es administrador
        children: [
            { path: 'productos', component: ProductosComponent }, // Para administrador de empresa
            {path:'categorias',component:CategoriasComponent},
            {path:'sucursales',component:SucursalesComponent}
        ]
    },
    {
        path:'empresa/:idempresa/sucursal/:idsucursal/admin',
        component:SucursalAdminlayoutComponent,
        children:[
            {path:'misproductos',component:MisproductosComponent},
        ]
    }
    // // Ruta de redirección para cualquier ruta no encontrada
    // { path: '**', redirectTo: '' }
];
