import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { ICarBody } from 'src/app/models/carBody';
import { CarBodyService } from 'src/app/providers/carBodyService';
import { GlobalService } from 'src/app/providers/globalService';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';

@Component({
  selector: 'app-list-car-body',
  templateUrl: './list-car-body.component.html',
  styleUrls: ['./list-car-body.component.css'],
})
export class ListCarBodyComponent implements OnInit {
  carBodies: ICarBody[] = [];
  action = 'ON_CREATE';
  carBodyForm!: FormGroup;
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  loading = false;
  saveButtonName = 'Enregistrer';

  constructor(
    private carBodyService: CarBodyService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.createCarBodyForm();
    this.allCarBody(this.pageNo, this.pageSize);
  }

  allCarBody(pageIndex: number, pageSize: number) {
    this.loading = true;

    this.carBodyService.all(pageIndex, pageSize).subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.carBodies = data.object.content;
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
    this.allCarBody(event.page, this.pageSize);
  }

  onCreate() {
    this.saveButtonName = 'Enregistrer';
    this.action = 'ON_CREATE';
    this.carBodyForm.reset();
  }

  onUpdate(carBody: ICarBody) {
    this.saveButtonName = 'Modifier';
    this.action = 'ON_UPDATE';
    this.carBodyForm.setValue(carBody);
  }

  onDelete(carBody: ICarBody) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir supprimer cette carrosseries ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        this.deleteCarBody(carBody);
      }
    });
  }

  createCarBodyForm() {
    this.carBodyForm = this.fb.group({
      id: [null],
      body: [null, [Validators.required]],
    });
  }

  onSave(carBody: ICarBody) {
    switch (this.action) {
      case 'ON_CREATE':
        if (this.saveButtonName == 'Enregistrement en cours ...') return;
        this.saveButtonName = 'Enregistrement en cours ...';

        this.createCarBody(carBody);
        break;

      case 'ON_UPDATE':
        if (this.saveButtonName == 'Modification en cours ...') return;
        this.saveButtonName = 'Modification en cours ...';
        this.updateICarBody(carBody);
        break;

      default:
        break;
    }
  }

  createCarBody(carBody: ICarBody) {
    const responseApi$: Observable<any> = this.carBodyService.create(carBody);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.carBodies.unshift(data.object);

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

  updateICarBody(carBody: ICarBody) {
    const responseApi$: Observable<any> = this.carBodyService.update(
      carBody.id as number,
      carBody
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.carBodies.findIndex((d) => d.id == carBody.id);
          this.carBodies.splice(
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

  deleteCarBody(carBody: ICarBody) {
    const responseApi$: Observable<any> = this.carBodyService.delete(
      carBody.id as number
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.carBodies.findIndex((d) => d.id == carBody.id);
          this.carBodies.splice(
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
