import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  private widthBehaviorSubject = new BehaviorSubject<number>(window.innerWidth - 96);

  get width$(): Observable<number> {
    return this.widthBehaviorSubject.asObservable();
  }

  setWidth(width: number): void {
    this.widthBehaviorSubject.next(width);
  }
}
