import { Observable, timer } from 'rxjs';
import { distinctUntilChanged, filter, mapTo, switchMap } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs/internal/types';

export function delay<T>(delayMs: number): MonoTypeOperatorFunction<T> {
  return source => source.pipe(switchMap(value => timer(delayMs).pipe(mapTo(value))));
}

export function change<T>(obs: Observable<T | null | undefined>): Observable<T> {
  return (obs.pipe(filter(v => !!v)) as Observable<T>).pipe(distinctUntilChanged());
}

export function changeId(obs: Observable<number | null | undefined>): Observable<number> {
  return (obs.pipe(filter(v => !!v)) as Observable<number>).pipe(distinctUntilChanged());
}
