import { Injectable } from '@angular/core';
import { PRINCIPAL_BREAKPOINT } from '../contanst';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  get isMobileScreen(): boolean {
    return window.innerWidth < PRINCIPAL_BREAKPOINT;
  }
}
