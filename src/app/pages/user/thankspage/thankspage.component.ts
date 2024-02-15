import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thankspage',
  standalone: true,
  imports: [],
  templateUrl: './thankspage.component.html',
  styleUrl: './thankspage.component.css'
})
export class ThankspageComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private routeSubscription: Subscription | undefined;

  ngOnInit() {
    // Inicializa la suscripción en ngOnInit
    this.routeSubscription = this.route.parent?.params.subscribe(params => {
      // Guarda los parámetros o realiza acciones cada vez que cambian
      // Por ejemplo, puedes guardarlos en variables de instancia si necesitas
    });
  }

  toemmpresa() {
    // Asumiendo que necesitas los parámetros inmediatamente para navegar
    this.route.parent?.params.subscribe(params => {
      const idempresa = params['idempresa'];
      const idsucursal = params['idsucursal'];
      const rutaPadre = `/empresa/${idempresa}/sucursal/${idsucursal}`;
      this.router.navigateByUrl(rutaPadre);
    }).unsubscribe(); // Desuscribirse inmediatamente para evitar fugas de memoria si solo necesitas los parámetros una vez
  }

  ngOnDestroy() {
    // Asegúrate de limpiar la suscripción cuando el componente se destruya
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
