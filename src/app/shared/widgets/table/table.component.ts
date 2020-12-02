import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { DashboardService } from 'src/app/modules/dashboard.service';

@Component({
  selector: 'app-widget-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {

  public loginLogs: any;
  public logArray: any[] = [];
  displayedColumns: string[] = ['action', 'date', 'time', 'from', 'empid', 'username', 'name'];
  public dataSource;
  logSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private dashService: DashboardService, private authService: AuthService) { }

  ngOnInit(): void {
    this.dashService.logs();
    this.logSubscription = this.dashService.getLogSubjectasObs().subscribe(logs => {
      this.logArray = logs;
      console.log("logsArry ",this.logArray);
      this.dataSource = new MatTableDataSource<any>(this.logArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onDownloadLogs() {
    // this.excelService.exportAsExcelFile(this.logArray, 'logs');
  }

  ngOnDestroy() {
    this.logSubscription.unsubscribe();
  }

}


