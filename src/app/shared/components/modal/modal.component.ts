import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/modules/auth/auth.service';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  private modalTimer;
  private secInterval;
  public sec = 10;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {maxTimeout: number}
    ) { }

  ngOnInit(): void {
    // this.maxTimeout = this.authService.getMaxTimeout();
    console.log("maxTimeout in Modal ==> ", this.data.maxTimeout);
    if (this.data.maxTimeout > 0 && this.data.maxTimeout != null) {
      this.modalTimer = setTimeout(() => {
        this.dialogRef.close('TIMEDOUT');
      }, 10000);
      this.secInterval = setInterval(() => {
        --this.sec;
      }, 1000)
    } else {
      clearTimeout(this.modalTimer);
      clearInterval(this.secInterval);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    clearTimeout(this.modalTimer);
    clearInterval(this.secInterval);
}

}

