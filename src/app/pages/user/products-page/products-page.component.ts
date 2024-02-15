import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsComponent } from '../../../features/user/components/products/products.component';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductsComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css'
})
export class ProductsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dataservice = inject(ApiServiceService);
  nombreSucursal: string = '';
  products: any[] = [];
  globalcolor = 'green';
  tittle = 'pollo';
  selectedFilter = 'low';
  empresaid: number = 0;
  sucursalid: number = 0;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.empresaid = params['idempresa'];
      this.sucursalid = params['idsucursal'];
      this.dataservice
        .getData(ApiType.Public,'productos',{"idsucursal":this.sucursalid})
        .subscribe((data) => {
          this.products = data;
          this.nombreSucursal = data[0].nombreSucursal;
        });
    });
  }

}
