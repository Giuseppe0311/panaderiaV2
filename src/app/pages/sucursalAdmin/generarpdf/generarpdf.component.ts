import { Component, OnInit } from '@angular/core';
import { DataSharingService } from '../../shared/data-sharing.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-generarpdf',
  standalone: true,
  imports: [],
  templateUrl: './generarpdf.component.html',
  styleUrl: './generarpdf.component.css'
})
export class GenerarpdfComponent implements OnInit {

  constructor(private dataSharingService: DataSharingService) { }
  fecha: any;
  num_comprobante: any;
  tipo_comprobante: any;
  tipo_pago: any;
  usuario: any;
  nombre_sucursal: any;
  total: any;
  datoProductospdf: any[] = [];
  ngOnInit(): void {
    this.dataSharingService.currentVentaData.subscribe(data => {
      if (data) {
        // Asignación de los datos recibidos a las variables
        this.fecha = data.fecha;
        this.num_comprobante = data.num_comprobante;
        this.tipo_comprobante = data.tipo_comprobante;
        this.tipo_pago = data.tipo_pago;
        this.usuario = data.usuario;
        this.nombre_sucursal = data.nombre_sucursal;
        this.total = data.total;
        this.datoProductospdf = data.detalleVentas;
      }
    });
  }

  generarPDF() {
    // Espera a que la vista se actualice con los nuevos datos
      const data = document.getElementById('boletapago');
      if (data) {
        html2canvas(data, { scale: 1 }).then(canvas => {
          const imgWidth = 208; // Ancho de A4 en mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const contentDataURL = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('comprobante.pdf');
        });
      }
    }; // El setTimeout con 0 retrasa la ejecución hasta el próximo ciclo del event loop, permitiendo que la vista se actua
}
