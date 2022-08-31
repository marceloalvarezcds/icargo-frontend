import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.scss'],
})
export class KeyValueComponent {
  @Input() key: string | undefined;
  @Input() value: string | number | null | undefined;
  @Input() inline = true;
}
