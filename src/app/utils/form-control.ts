import { FormControl } from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { changeId } from './observable';

export function getIdFromAny(value: any): number | undefined {
  if (value) {
    return typeof value === 'string' || typeof value === 'number'
      ? Number(value)
      : Number(value.id);
  }
  return undefined;
}

export function valueChange(control: FormControl): Observable<number> {
  return changeId(control.valueChanges);
}

export function valueMerge(...controls: FormControl[]): Observable<number> {
  const obs = controls.map((o) => valueChange(o));
  return merge(...obs);
}
