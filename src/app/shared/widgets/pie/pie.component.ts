import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/modules/dashboard.service';

@Component({
  selector: 'app-widgets-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {

  chartOptions;
  Highcharts = Highcharts;
  pieSubscription: Subscription;
  constructor(private dashService: DashboardService) { }

  ngOnInit(): void {
    this.pieSubscription = this.dashService.getPieSubjectasObs().subscribe(data => {
      console.log("pie data ", data);
      this.chartOptions = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Sign in From'
        },
        subtitle: {
          text: 'Total Sign in from data'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        exporting: {
          enabled: true
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: data
        }]
      }
    });

  }
}
