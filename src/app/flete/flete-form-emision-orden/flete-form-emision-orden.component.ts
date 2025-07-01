import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { FleteDestinatarioEnum } from 'src/app/enums/flete-destinatario-enum';
import { Flete } from 'src/app/interfaces/flete';
import { FleteDestinatario } from 'src/app/interfaces/flete-destinatario';
import { TextoLegal } from 'src/app/interfaces/texto-legal';
import { FleteService } from 'src/app/services/flete.service';
import { TextoLegalService } from 'src/app/services/texto-legal.service';

@Component({
  selector: 'app-flete-form-emision-orden',
  templateUrl: './flete-form-emision-orden.component.html',
  styleUrls: ['./flete-form-emision-orden.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleteFormEmisionOrdenComponent implements OnInit, OnDestroy {

  D = FleteDestinatarioEnum;
  list: FleteDestinatario[] = [];

  formGroup?: FormGroup;
  groupName = 'emision_orden';
  destinoId?: number;
  destinoSubscription?: Subscription;
  origenId?: number;
  origenSubscription?: Subscription;
  remitenteId?: number;
  remitenteSubscription?: Subscription;

  textoLegalEventsSubject: Subject<TextoLegal> = new Subject<TextoLegal>();

  @Input() isShow = false;
  @Input() isEdit = false;
  @Input() flete?: Flete;

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.destinoSubscription = this.destinoControl.valueChanges.subscribe(
      (val) => {
        this.destinoId = val;
        this.getList();
      }
    );
    this.origenSubscription = this.origenControl.valueChanges.subscribe(
      (val) => {
        this.origenId = val;
        this.getList();
      }
    );
    this.remitenteSubscription = this.remitenteControl.valueChanges.subscribe(
      (val) => {
        this.remitenteId = val;
        this.getList();
      }
    );
  }

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get info(): FormGroup {
    return this.formGroup!.get('info') as FormGroup;
  }

  get destinoControl(): FormControl {
    return this.tramo.get('destino_id') as FormControl;
  }

  get origenControl(): FormControl {
    return this.tramo.get('origen_id') as FormControl;
  }

  get remitenteControl(): FormControl {
    return this.info.get('remitente_id') as FormControl;
  }

  get tramo(): FormGroup {
    return this.formGroup!.get('tramo') as FormGroup;
  }

  get textoLegalControl(): FormControl {
    return this.group.get('emision_orden_texto_legal') as FormControl;
  }

  constructor(
    private fleteService: FleteService,
    private textoLegalService: TextoLegalService,
  ) {}

  ngOnDestroy(): void {
    this.destinoSubscription?.unsubscribe();
    this.origenSubscription?.unsubscribe();
    this.remitenteSubscription?.unsubscribe();
  }

  ngOnInit(){
    if (this.isEdit || this.isShow) {

      this.group.get('emision_orden_texto_legal')?.valueChanges
        .pipe(
          //debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {

          if (value) {
            // Solo una vez se debe actualizar vista al editar
            setTimeout(() => {

              this.textoLegalService.geItemByTitletList(value).subscribe( f => {

                this.textoLegalEventsSubject.next(f);
              });

            }, 500);

          }

      });

    } else {
      this.selectTextoLegal();
    }
  }

  selectTextoLegal(){
    const textoLegal = "POR DEFECTO";
    this.textoLegalService.geItemByTitletList(textoLegal)
      .subscribe( resp=> {
        console.log("resp: ", resp);
        this.textoLegalEventsSubject.next(resp);
      })
  }

  compareWith(o1?: FleteDestinatario, o2?: FleteDestinatario): boolean {
    return o1?.id === o2?.id;
  }

  private getList(): void {
    if (this.remitenteId && this.origenId && this.destinoId) {
      this.fleteService
        .getDestinatarioList(this.remitenteId, this.origenId, this.destinoId)
        .subscribe((list) => (this.list = list));
    }
  }
}
