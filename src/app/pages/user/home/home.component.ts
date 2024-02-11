import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  private dataservice = inject(ApiServiceService)
  datos : any[] = []
  ngOnInit(): void {
    this.dataservice.getData(ApiType.Public,'empresas').subscribe(data =>{
      this.datos=data
      console.log(data)
    })
  }
}
