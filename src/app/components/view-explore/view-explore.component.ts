import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'app-view-explore',
  templateUrl: './view-explore.component.html',
  styleUrls: ['./view-explore.component.css']
})
export class ViewExploreComponent implements OnInit {
  filteredOptions: Observable<string[]>;
  searchedTouched: Observable<boolean>;

  constructor(private errorService: ErrorsService) { }

  ngOnInit() {
    this.filteredOptions = this.errorService.getSearchInput();
    this.searchedTouched = this.errorService.getSearchCondition();
  }

}
