import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import {
  ApiServiceService,
  ApiType,
} from '../../../core/services/api-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public chartbar: any;
  public charCircular: any;
  router = inject(ActivatedRoute);
  idsucursal: number | null = null;
  apiservice = inject(ApiServiceService);
  ngOnInit(): void {
    this.router.parent?.params.subscribe((params) => {
      this.idsucursal = Number(params['idsucursal']);
    });
    this.obtenerdata();
    // this.createChart();
  }
  obtenerdata() {
    this.apiservice
      .getData(ApiType.AdminSucursal, 'ventas', {
        productosMasVendidosPorSucursal: this.idsucursal,
      })
      .subscribe((data) => {
        this.actualizarGraficaBarra(data);
      });
    this.apiservice
      .getData(ApiType.AdminSucursal, 'ventas', {
        idSucursalVentasPorTipoPago: this.idsucursal,
      })
      .subscribe((data) => {
        console.log(data);
        this.actualizarGraficaCircular(data);
      });
  }
  actualizarGraficaBarra(data: any[]) {
    const productos = data.map((d) => d.producto);
    const totalesVenta = data.map((d) => d.totalVenta);

    if (this.chartbar) this.chartbar.destroy(); // Destruye la instancia anterior si existe

    this.chartbar = new Chart('bar', {
      type: 'bar',
      data: {
        labels: productos,
        datasets: [
          {
            label: 'Dinero Recaudado',
            data: totalesVenta,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  actualizarGraficaCircular(data: any[]) {
    const tiposPago = data.map((d, i) => `${d.tipoPago} (${d.porcentajeDelTotal}%)`);
    const totalesPorMetodo = data.map((d) => d.totalPorMetodo);

    if (this.charCircular) this.charCircular.destroy(); // Destruye la instancia anterior si existe

    this.charCircular = new Chart('circular', {
      type: 'doughnut',
      data: {
        labels: tiposPago,
        datasets: [
          {
            label: 'Total pagado por método de pago',
            data: totalesPorMetodo ,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              // Añade más colores si tienes más tipos de pago
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              // Añade más colores si tienes más tipos de pago
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
}
