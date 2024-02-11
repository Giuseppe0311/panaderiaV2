import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private ventaData = new BehaviorSubject<any>(null);

  currentVentaData = this.ventaData.asObservable();

  constructor() { }

  updateVentaData(data: any) {
    this.ventaData.next(data);
  }
}
