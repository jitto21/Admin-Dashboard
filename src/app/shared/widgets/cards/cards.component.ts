import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/modules/dashboard.service';

@Component({
  selector: 'app-widget-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {

  @Input() label: string;
  users: number;
  userDiff: number;

  cardSubscription: Subscription;
  chartOptions;
  Highcharts = Highcharts;

  constructor(private dashService: DashboardService) { }

  ngOnInit(): void {
    this.dashService.signupLogs();
    this.cardSubscription =  this.dashService.getCardSubjectasObs().subscribe(data => {
      this.users = data.users;
      this.userDiff = data.userDiff;
      console.log("card data in comp ",data);
      this.chartOptions = {
        chart: {
          zoomType: 'xy'
        },
        title: {
          text: null
        },
        subtitle: {
          text: null
        },
        xAxis: [{
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          crosshair: true
        }],
        yAxis: [{ // Primary yAxis
          title: {
            text: 'Users',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          }
        }],
        tooltip: {
          shared: true
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          x: 120,
          verticalAlign: 'top',
          y: 100,
          floating: true,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
        },
        exporting: {
          enabled: true
        },
        series: [{
          name: 'Users',
          type: 'spline',
          data: data.monthArr
        }]
      };
    })
    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      )
    }, 300);
  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
  }

}
