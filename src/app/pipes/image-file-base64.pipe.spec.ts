import { fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { fakeFile } from '../utils/test';
import { ImageFileBase64Pipe } from './image-file-base64.pipe';

describe('ImageFileBase64Pipe', () => {

  const pipe = new ImageFileBase64Pipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform', fakeAsync(() => {
    const transformSpy = spyOn(pipe, 'transform').and.callThrough();
    const observer = pipe.transform(fakeFile());
    const obsSpy = spyOn(observer, 'subscribe').and.callThrough();
    observer.subscribe()
    expect(transformSpy).toHaveBeenCalled();
    expect(obsSpy).toHaveBeenCalled();
  }));
});
