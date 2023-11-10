import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { ICarColor } from 'src/app/models/carColor';
import { CarColorService } from 'src/app/providers/carColorService';
import { GlobalService } from 'src/app/providers/globalService';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';

@Component({
  selector: 'app-list-car-color',
  templateUrl: './list-car-color.component.html',
  styleUrls: ['./list-car-color.component.css'],
})
export class ListCarColorComponent implements OnInit {
  carColors: ICarColor[] = [];
  action = 'ON_CREATE';
  carColorForm!: FormGroup;
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  loading = false;
  saveButtonName = 'Enregistrer';

  constructor(
    private carColorService: CarColorService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.createCarColorForm();
    this.allCarColor(this.pageNo, this.pageSize);
  }

  allCarColor(pageIndex: number, pageSize: number) {
    this.loading = true;

    this.carColorService.all(pageIndex, pageSize).subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.carColors = data.object.content;
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
    this.allCarColor(event.page, this.pageSize);
  }

  onCreate() {
    this.saveButtonName = 'Enregistrer';
    this.action = 'ON_CREATE';
    this.carColorForm.reset();
  }

  onUpdate(carColor: ICarColor) {
    this.saveButtonName = 'Modifier';
    this.action = 'ON_UPDATE';
    this.carColorForm.setValue(carColor);
  }

  onDelete(carColor: ICarColor) {
    const responseSwal$: Promise<boolean> = this.swalService.messageYesNo(
      'Êtes vous sûr ?',
      'Êtes-vous sûr de vouloir supprimer cette couleur de voiture ?',
      'Non!',
      'Oui! Supprimer'
    );

    responseSwal$.then((res: boolean) => {
      if (res) {
        this.deleteCarColor(carColor);
      }
    });
  }

  createCarColorForm() {
    this.carColorForm = this.fb.group({
      id: [null],
      color: [null, [Validators.required]],
    });
  }

  onSave(carColor: ICarColor) {
    switch (this.action) {
      case 'ON_CREATE':
        if (this.saveButtonName == 'Enregistrement en cours ...') return;
        this.saveButtonName = 'Enregistrement en cours ...';

        this.createCarColor(carColor);
        break;

      case 'ON_UPDATE':
        if (this.saveButtonName == 'Modification en cours ...') return;
        this.saveButtonName = 'Modification en cours ...';
        this.updateICarColor(carColor);
        break;

      default:
        break;
    }
  }

  createCarColor(carColor: ICarColor) {
    const responseApi$: Observable<any> = this.carColorService.create(carColor);

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.carColors.unshift(data.object);

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

  updateICarColor(carColor: ICarColor) {
    const responseApi$: Observable<any> = this.carColorService.update(
      carColor.id as number,
      carColor
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.carColors.findIndex((d) => d.id == carColor.id);
          this.carColors.splice(
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

  deleteCarColor(carColor: ICarColor) {
    const responseApi$: Observable<any> = this.carColorService.delete(
      carColor.id as number
    );

    responseApi$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const position = this.carColors.findIndex((d) => d.id == carColor.id);
          this.carColors.splice(
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
