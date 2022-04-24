import { Router } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';

export function redirectToShowOC(router: Router, oc_id: number): void {
  const url = router.serializeUrl(
    router.createUrlTree([`/orden-carga/${m.ORDEN_CARGA}/${a.VER}`, oc_id])
  );
  window.open(url, '_blank');
}
