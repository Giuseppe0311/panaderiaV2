import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { relative } from 'path';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-navbarsuperadmin',
  standalone: true,
  imports: [],
  templateUrl: './navbarsuperadmin.component.html',
  styleUrl: './navbarsuperadmin.component.css'
})
export class NavbarsuperadminComponent implements OnInit {
  isLogged = false;
  usuario : string ='';
  router = inject(Router);
  route = inject(ActivatedRoute);
  private authservice = inject(AuthService);
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
  }
  toempresas(){
    this.router.navigate(['empresas'], {relativeTo: this.route});
  }
  tousuarios(){
    this.router.navigate(['usuarios'], {relativeTo: this.route});
  }
  cerrarSesion(){
    this.authservice.logout()
    this.isLogged = false
    this.router.navigate(['/']);
  }

}
