import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  bigChart = [];
  cards: number[] = [];
  constructor(private dashService: DashboardService) { }

  ngOnInit(): void {
    this.bigChart = this.dashService.bigChart();
    this.cards = this.dashService.cards();

  }

}
