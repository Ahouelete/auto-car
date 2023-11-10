import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { IVehiculeModel } from 'src/app/models/vehiculeModel';
import { GlobalService } from 'src/app/providers/globalService';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';
import { VehiculeModelService } from 'src/app/providers/vehiculeModelService';

@Component({
  selector: 'app-list-vehicule-model',
  templateUrl: './list-vehicule-model.component.html',
  styleUrls: ['./list-vehicule-model.component.css'],
})
export class ListVehiculeModelComponent implements OnInit {
  vehiculeModels: IVehiculeModel[] = [];
  action = 'ON_CREATE';
  vehiculeModelForm!: FormGroup;
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  loading = false;
  saveButtonName = 'Enregistrer';

  constructor(
    private vehiculeModelService: VehiculeModelService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.createVehiculeModelForm();
    this.allVehiculeModel(this.pageNo, this.pageSize);
  }

  allVehiculeModel(pageIndex: number, pageSize: number) {
    this.loading = true;

    this.vehiculeModelService.all(pageIndex, pageSize).subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.vehiculeModels = data.object.content;
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
    this.allVehiculeModel(event.page, this.pageSize);
  }

  onCreate() {
    this.saveButtonName = 'Enregistrer';
    this.action = 'ON_CREATE';
    this.vehiculeModelForm.reset();
  }

  onUpdate(vehiculeModel: IVehiculeModel) {
    this.saveButtonName = 'Modifier';
    this.action = 'ON_UPDATE';
    this.vehiculeModelForm.setValue(vehiculeModel);
  }

  onDelete(vehiculeModel: IVehiculeModel) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir supprimer ce modèle de voiture ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        this.deleteVehiculeModel(vehiculeModel);
      }
    });
  }

  createVehiculeModelForm() {
    this.vehiculeModelForm = this.fb.group({
      id: [null],
      make: [null, [Validators.required]],
      year: [null, [Validators.required, Validators.min(1000)]],
      model: [null, [Validators.required]],
    });
  }

  onSave(vehiculeModel: IVehiculeModel) {
    switch (this.action) {
      case 'ON_CREATE':
        if (this.saveButtonName == 'Enregistrement en cours ...') return;
        this.saveButtonName = 'Enregistrement en cours ...';

        this.createVehiculeModel(vehiculeModel);
        break;

      case 'ON_UPDATE':
        if (this.saveButtonName == 'Modification en cours ...') return;
        this.saveButtonName = 'Modification en cours ...';
        this.updateVehiculeModel(vehiculeModel);
        break;

      default:
        break;
    }
  }

  createVehiculeModel(vehiculeModel: IVehiculeModel) {
    const responseApi$: Observable<any> =
      this.vehiculeModelService.create(vehiculeModel);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.vehiculeModels.unshift(data.object);

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

  updateVehiculeModel(vehiculeModel: IVehiculeModel) {
    const responseApi$: Observable<any> = this.vehiculeModelService.update(
      vehiculeModel.id as number,
      vehiculeModel
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.vehiculeModels.findIndex(
            (d) => d.id == vehiculeModel.id
          );
          this.vehiculeModels.splice(
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

  deleteVehiculeModel(vehiculeModel: IVehiculeModel) {
    const responseApi$: Observable<any> = this.vehiculeModelService.delete(
      vehiculeModel.id as number
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.vehiculeModels.findIndex(
            (d) => d.id == vehiculeModel.id
          );
          this.vehiculeModels.splice(
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
