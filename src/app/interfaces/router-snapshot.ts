import { Params } from '@angular/router';

export interface RouterSnapshot {
  data: any;
  params: Params;
  queryParams: Params;
}
