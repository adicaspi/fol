import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { LoginComponent } from '../login/login.component';
@Component({
  selector: 'app-mutual-nav',
  templateUrl: './mutual-nav.component.html',
  styleUrls: ['./mutual-nav.component.css']
})
export class MutualNavComponent implements OnInit {
  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    //this.dialogService.openDialog(LoginComponent);
  }
}
