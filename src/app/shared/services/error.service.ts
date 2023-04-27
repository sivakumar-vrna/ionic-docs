import { Injectable } from '@angular/core';
import { ToastWidget } from 'src/app/widgets/toast.widget';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    public toast: ToastWidget,
    private authservice: AuthService,
  ) { }

  onError(err: any) {
    if (err?.message) {
      this.toast.onFail(err.message, err.statusCode);
    } else if (err?.statusCode) {
      this.onErrorMsg(err.statusCode);
    } else {
      this.toast.onFail('Error');
    }
  }
  onErrorMsg(status: any) {
    const statusCode: string = String(status);
    let errorMsg: string = null;
    switch (statusCode) {
      case '0': {
        errorMsg = 'Server Unavailable';
        break;
      }
      case '400': {
        errorMsg = 'Bad Request';
        break;
      }
      case '401': {
        errorMsg = 'Unauthorized';
        break;
      }
      case '402': {
        errorMsg = 'Payment Required';
        break;
      }
      case '403': {
        errorMsg = 'Forbidden';
        break;
      }
      case '404': {
        errorMsg = 'Server Unavailable';
        break;
      }
      case '405': {
        errorMsg = 'Method Not Allowed';
        break;
      }
      case '408': {
        errorMsg = 'Request Timeout';
        break;
      }
      case '429': {
        errorMsg = 'Too Many Requests';
        break;
      }
      case '451': {
        errorMsg = 'Unauthorized Session!';
        this.authservice.logout();
        break;
      }
      case '454': {
        errorMsg = 'Unauthorized Session!';
        this.authservice.logout();
        break;
      }
      case '500': {
        errorMsg = 'Internal Server Error';
        break;
      }
      case '502': {
        errorMsg = 'Failed to send';
        break;
      }
      case '503': {
        errorMsg = 'Server Unavailable';
        break;
      }
      case '504': {
        errorMsg = 'Gateway Timeout';
        break;
      }
      case '505': {
        errorMsg = 'HTTP Version Not Supported';
        break;
      }
      default:
        errorMsg = `Hey! There is an error (Code - ${statusCode})`;
    }
    this.toast.onFail(errorMsg);
  }
}
