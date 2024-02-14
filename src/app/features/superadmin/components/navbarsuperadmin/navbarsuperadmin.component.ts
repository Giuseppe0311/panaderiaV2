import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { relative } from 'path';

@Component({
  selector: 'app-navbarsuperadmin',
  standalone: true,
  imports: [],
  templateUrl: './navbarsuperadmin.component.html',
  styleUrl: './navbarsuperadmin.component.css'
})
export class NavbarsuperadminComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  toempresas(){
    this.router.navigate(['empresas'], {relativeTo: this.route});
  }
  tousuarios(){
    this.router.navigate(['usuarios'], {relativeTo: this.route});
  }

}
