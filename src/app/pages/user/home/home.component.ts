import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiServiceService, ApiType } from '../../../core/services/api-service.service';
import { AuthService } from '../../../auth/services/auth.service';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  private dataservice = inject(ApiServiceService)
  private authservice = inject(AuthService)
  private router = inject(Router)
  isLogged = false
  usuario : string =''
  datos : any[] = []
  ngOnInit(): void {
    this.authservice.currentUserLoginOn.subscribe(data => {
      if(data){
        console.log(data)
        this.isLogged = true
        this.authservice.currentUserData.subscribe(data => {
          console.log(data)
          if(data){
            this.usuario = data.sub
          }
        })
      }
    })

    this.dataservice.getData(ApiType.Public,'empresas').subscribe(data =>{
      this.datos=data
      console.log(data)
    })
  }
  cerrarSession(){
    this.authservice.logout()
    this.isLogged = false
  }
}
