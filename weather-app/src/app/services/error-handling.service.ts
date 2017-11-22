import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';
import { errorsConfig } from '../config/errors-config';

@Injectable()
export class ErrorHandlingService {
  constructor(private snackBar: MatSnackBar) { }

  public handleError(msg: string, code?: number): void {

    this.snackBar.open(msg, 'Close', errorsConfig);
  }
}
