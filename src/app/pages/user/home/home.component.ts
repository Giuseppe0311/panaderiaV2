import { Component, OnInit, inject } from '@angular/core';
import { UserApiService } from '../../../features/user/services/user-api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  private dataservice = inject(UserApiService)
  datos : any[] = []
  ngOnInit(): void {
    this.dataservice.getData('empresas').subscribe(data =>{
      this.datos=data
      console.log(data)
    })
  }
}
