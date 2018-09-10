import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ModalDialogComponent
  ],
  declarations: [
    ModalDialogComponent
  ],
  entryComponents: [ModalDialogComponent]
})
export class SharedModule { }
