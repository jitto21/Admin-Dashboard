import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/modules/dashboard.service';

@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  chartOptions;
  Highcharts = Highcharts;
  bigSubscription: Subscription;

  constructor(private dashService: DashboardService) { }

  ngOnInit(): void {
    this.bigSubscription = this.dashService.getBigSubjectasObs().subscribe(data => {
      console.log("Big Data in Comp ", data);
      this.chartOptions = {
        chart: {
          type: 'area'
        },
        title: {
          text: 'Login Time Pattern'
        },
        subtitle: {
          text: 'Total no:of login/logout attempts by users in 24hr time'
        },
        xAxis: {
          categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
          '13:00', '14:00', '15:00', '16:00','17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
          tickmarkPlacement: 'on',
          title: {
            text: 'Time (IST)'
          }
        },
        yAxis: {
          title: {
            text: 'No:of Users'
          },
          labels: {

          }
        },
        tooltip: {
          split: true,
          valueSuffix: ' users'
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: true
        },
        series: data
      };
      HC_exporting(Highcharts);

      setTimeout(() => {
        window.dispatchEvent(
          new Event('resize')
        )
      }, 300);
    })

  }

}
