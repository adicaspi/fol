import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { DialogService } from '../../services/dialog.service';
@Component({
  selector: 'app-mutual-nav',
  templateUrl: './mutual-nav.component.html',
  styleUrls: ['./mutual-nav.component.css']
})
export class MutualNavComponent implements OnInit {
  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    this.dialogService.openDialog(RegisterComponent);
  }
}
