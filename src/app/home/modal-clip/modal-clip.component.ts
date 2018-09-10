import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipService } from '../../shared/services/clip.service';

@Component({
  selector: 'app-modal-clip',
  templateUrl: './modal-clip.component.html',
  styleUrls: ['./modal-clip.component.scss']
})
export class ModalClipComponent implements OnInit {
  clipForm: FormGroup;
  isValidated = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalClipComponent>,
    private formBuilder: FormBuilder,
    private clipService: ClipService
  ) { }

  ngOnInit() {
    this.clipForm = this.formBuilder.group({
      name: [this.data && this.data.name ? this.data.name : null, [Validators.required]],
      timeStart: [this.data && this.data.timeStart ? this.data.timeStart : null, [Validators.required]],
      timeEnd: [this.data && this.data.timeEnd ? this.data.timeEnd : null, [Validators.required]],
      clipId: [this.data && this.data.clipId ? this.data.clipId : null, null]
    });
  }
  submit() {
    this.isValidated = true;
    if (this.clipForm.valid) {
      this.closeModal(this.clipForm.value);
    }
  }
  closeModal(value) {
    this.dialogRef.close(value);
  }

}
