import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { IEnginePower } from 'src/app/models/enginePower';
import { EnginePowerService } from 'src/app/providers/enginePowerService';
import { GlobalService } from 'src/app/providers/globalService';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';

@Component({
  selector: 'app-list-engine-power',
  templateUrl: './list-engine-power.component.html',
  styleUrls: ['./list-engine-power.component.css'],
})
export class ListEnginePowerComponent implements OnInit {
  enginePowers: IEnginePower[] = [];
  action = 'ON_CREATE';
  enginePowerForm!: FormGroup;
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  loading = false;
  saveButtonName = 'Enregistrer';

  constructor(
    private enginePowerService: EnginePowerService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.createEnginePowerForm();
    this.allEnginePower(this.pageNo, this.pageSize);
  }

  allEnginePower(pageIndex: number, pageSize: number) {
    this.loading = true;

    this.enginePowerService.all(pageIndex, pageSize).subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.enginePowers = data.object.content;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  paginate(event: any) {
    this.loading = true;
    this.pageSize = event.rows;
    this.allEnginePower(event.page, this.pageSize);
  }

  onCreate() {
    this.saveButtonName = 'Enregistrer';
    this.action = 'ON_CREATE';
    this.enginePowerForm.reset();
  }

  onUpdate(enginePower: IEnginePower) {
    this.saveButtonName = 'Modifier';
    this.action = 'ON_UPDATE';
    this.enginePowerForm.setValue(enginePower);
  }

  onDelete(enginePower: IEnginePower) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir supprimer cette puissance ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        this.deleteEnginePower(enginePower);
      }
    });
  }

  createEnginePowerForm() {
    this.enginePowerForm = this.fb.group({
      id: [null],
      power: [null, [Validators.required]],
    });
  }

  onSave(enginePower: IEnginePower) {
    switch (this.action) {
      case 'ON_CREATE':
        if (this.saveButtonName == 'Enregistrement en cours ...') return;
        this.saveButtonName = 'Enregistrement en cours ...';

        this.createEnginePower(enginePower);
        break;

      case 'ON_UPDATE':
        if (this.saveButtonName == 'Modification en cours ...') return;
        this.saveButtonName = 'Modification en cours ...';
        this.updateEnginePower(enginePower);
        break;

      default:
        break;
    }
  }

  createEnginePower(enginePower: IEnginePower) {
    const responseApi$: Observable<any> =
      this.enginePowerService.create(enginePower);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.enginePowers.unshift(data.object);

          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
          this.onCreate();
        } else {
          this.saveButtonName = 'Enregistrer';
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName = 'Enregistrer';

        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  updateEnginePower(enginePower: IEnginePower) {
    const responseApi$: Observable<any> = this.enginePowerService.update(
      enginePower.id as number,
      enginePower
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.enginePowers.findIndex(
            (d) => d.id == enginePower.id
          );
          this.enginePowers.splice(
            position > -1 ? position : 0,
            position > -1 ? 1 : 0,
            data.object
          );
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);

          this.onCreate();
        } else {
          this.saveButtonName = 'Modifier';
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.saveButtonName = 'Modifier';

        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  deleteEnginePower(enginePower: IEnginePower) {
    const responseApi$: Observable<any> = this.enginePowerService.delete(
      enginePower.id as number
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.enginePowers.findIndex(
            (d) => d.id == enginePower.id
          );
          this.enginePowers.splice(
            position > -1 ? position : 0,
            position > -1 ? 1 : 0
          );

          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
          this.onCreate();
        } else {
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }
}
