import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';

@Component({
  selector: 'app-sucursal-selecction',
  standalone: true,
  imports: [],
  templateUrl: './sucursal-selecction.component.html',
  styleUrl: './sucursal-selecction.component.css'
})
export class SucursalSelecctionComponent implements OnInit{
  private route = inject(ActivatedRoute)
  private dataservice=inject(ApiServiceService)
  private router= inject(Router)
  private selectedIdEmpresa : number = 0
  private idEmpresa:number = 0
  data :any = []
  parametro : string=""
  nombreEmpresa: any = {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idEmpresa=params['idempresa']
      this.dataservice.getData(ApiType.Public,'sucursales',{"idempresa":this.idEmpresa}).subscribe(data => {
        this.data = data
        console.log(data)
        if (data.length>=1) {
          this.selectedIdEmpresa=data[0].id
        }
      })
      this.dataservice.getData(ApiType.Public,'empresas',{"idempresa":this.idEmpresa}).subscribe(nombreempresa =>{
        this.nombreEmpresa=nombreempresa
      })
    })
  }
  change(event:any){
    this.selectedIdEmpresa=event.target.value
  }
  toloyout() {
    this.router.navigate([`sucursal/${this.selectedIdEmpresa}`], { relativeTo: this.route });
  }

}
