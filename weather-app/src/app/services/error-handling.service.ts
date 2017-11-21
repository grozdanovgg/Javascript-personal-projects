import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorHandlingService {

  constructor(private snackBar: MatSnackBar) { }

  public handleError(msg: string, code?: number): void {
    this.snackBar.open(msg, 'Close', {
      duration: 5000
    });
  }
}
