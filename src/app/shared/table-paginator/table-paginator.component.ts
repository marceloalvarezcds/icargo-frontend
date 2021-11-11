import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { TableService } from 'src/app/services/table.service';
import { delay } from 'src/app/utils/observable';

@Component({
  selector: 'app-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss']
})
export class TablePaginatorComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<any>();
  pageOptions?: PageEvent;
  pageOptionsSubscription = this.tableService.getPageOptions()
    .pipe(delay(500))
    .subscribe((pageOptions) => {
      this.pageOptions = pageOptions
    });

  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() filterPredicate = this.dataSource.filterPredicate.bind(this.dataSource);
  @Input() formArray = new FormArray([]);
  @Input() hideShow = false;
  @Input() isShow = false;
  @Input() addShowButton = false;

  @Output() editClick = new EventEmitter<TableEvent<any>>();
  @Output() deleteClick = new EventEmitter<TableEvent<any>>();
  @Output() showClick = new EventEmitter<TableEvent<any>>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null = null;

  constructor(
    private tableService: TableService,
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.pageOptionsSubscription.unsubscribe();
  }

  setPageOptions(event: PageEvent): void {
    this.tableService.setPageOptions(event);
  }
}
