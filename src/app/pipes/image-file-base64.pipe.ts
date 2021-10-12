import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({
  name: 'imageFileBase64'
})
export class ImageFileBase64Pipe implements PipeTransform {

  transform(value: File): Observable<string | ArrayBuffer | null> {
    return new Observable((observer) => {
      const fr = new FileReader();
      fr.addEventListener('load', (event: ProgressEvent<FileReader>) => {
        observer.next(event.target!.result);
      });
      fr.readAsDataURL(value);
    });
  }
}
