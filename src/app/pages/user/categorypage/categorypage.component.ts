import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsComponent } from '../../../features/user/components/products/products.component';
import { switchMap } from 'rxjs';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';

@Component({
  selector: 'app-categorypage',
  standalone: true,
  imports: [ProductsComponent],
  templateUrl: './categorypage.component.html',
  styleUrl: './categorypage.component.css'
})
export class CategorypageComponent {

  idcategoria : number = 0
  idsucursal : number = 0
  idempresa : number=0
  dataservice = inject(ApiServiceService)
  route = inject(ActivatedRoute)
  data : any[] = []
  ngOnInit(): void {
    this.route.parent?.paramMap.pipe(
      switchMap(parentParams => {
        this.idsucursal = Number(parentParams.get('idsucursal'));
        this.idempresa=Number(parentParams.get('idempresa'))
        return this.route.paramMap;
      }),
      switchMap(params => {
        this.idcategoria = Number(params.get('idcategoria'));
  
        return this.dataservice.getData(ApiType.Public,'productos',{"idsucursal":this.idsucursal,"idcategoria":this.idcategoria});
      })
    ).subscribe(data => {
      this.data = data;
    });
  }

}
