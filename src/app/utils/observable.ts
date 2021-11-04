import { timer } from "rxjs";
import { mapTo, switchMap } from "rxjs/operators";
import { MonoTypeOperatorFunction } from "rxjs/internal/types";

export function delay<T>(delayMs: number): MonoTypeOperatorFunction<T> {
  return source => source.pipe(switchMap(value => timer(delayMs).pipe(mapTo(value))));
}
