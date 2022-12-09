import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlActive',
})
export class UrlActivePipe implements PipeTransform {
  private getPathStr(path: any[] | string | undefined): string {
    return path ? (Array.isArray(path) ? path.join('/') : path) : '/';
  }

  transform(path: any[] | string | undefined, currentUrl: string): boolean {
    const url = this.getPathStr(path);
    return (
      (url === '/' && currentUrl === '/') ||
      (url !== '/' && currentUrl.startsWith(url))
    );
  }
}
