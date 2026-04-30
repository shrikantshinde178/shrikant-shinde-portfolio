import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-visit-confirm',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './visit-confirm.html',
  styleUrls: ['./visit-confirm.scss'],
})
export class VisitConfirm {
  constructor(
    @Inject(MAT_DIALOG_DATA) public project: any,
    public dialogRef: MatDialogRef<VisitConfirm>,
  ) {}

  visit() {
    if (this.project.url) window.open(this.project.url, '_blank');
  }
}
