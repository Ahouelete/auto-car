import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { NavBarSimpleComponent } from './components/nav-bar-simple/nav-bar-simple.component';
import { TableModule } from 'primeng/table';
import { MatSelectModule } from '@angular/material/select';
import { PanierComponent } from './components/panier/panier.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { LoadingCustomComponent } from './components/loading-custom/loading-custom.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';

import { TagModule } from 'primeng/tag';

const modules = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  TableModule,
  MatSelectModule,
  DialogModule,
  ButtonModule,
  PaginatorModule,
  MatCheckboxModule,
  CarouselModule,
  TagModule,
  GalleriaModule,
];
const components = [
  FooterComponent,
  NavBarSimpleComponent,
  PanierComponent,
  LoadingCustomComponent,
];

@NgModule({
  declarations: [...components],
  imports: [...modules, RouterModule, CommonModule],
  exports: [...components, ...modules],
})
export class SharedModuleModule {}
