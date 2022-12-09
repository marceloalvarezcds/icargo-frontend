import { Params } from '@angular/router';

export interface RouterSnapshot {
  params: Params;
  queryParams: Params;
}
