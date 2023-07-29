import {Component, TemplateRef} from '@angular/core';
import {ToastService} from '../_services/toast.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './myToast.component.html',
  styleUrls: ['./myToast.component.css'],
  host: {'[class.ngb-toasts]': 'true'}
})
export class MyToastComponent {
  constructor(public toastService: ToastService) {
  }

  isTemplate(toast: { textOrTpl: any; }) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
