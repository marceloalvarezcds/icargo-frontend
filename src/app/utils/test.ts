import { DebugElement } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

export function findElement<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}

const blobOptions: BlobPropertyBag = {
  type: 'image/png',
};
const blob = new Blob([''], blobOptions);

export const fakeFile = (): File => {
  return blob as File;
};

const blobParts: BlobPart[] = ['content'];
const fileOptions: FilePropertyBag = {
  lastModified: 1634603497,
}
const file: File = new File(blobParts, 'test.png', fileOptions);
const dataTransfer = new DataTransfer();
dataTransfer.items.add(file);

export const fakeFileList: FileList = dataTransfer.files;

const latLng = new google.maps.LatLng(-24, -51);
export const mockMapMouseEvent: google.maps.MapMouseEvent = {
  latLng, domEvent: new MouseEvent('click'), stop: () => {},
};

mockMapMouseEvent.stop();
