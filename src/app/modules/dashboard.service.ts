import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private loginLogs: any;
  private logArray: any[] = [];
  private pieSubject = new Subject<any>();
  private logSubject = new Subject<any>();

  constructor(private authService: AuthService) { }

  bigChart() {
    return [{
        name: 'Client',
        data: [502, 635, 809, 947, 1402, 3634, 502, 635, 809, 947, 1402, 3634]
      }, {
        name: 'Home',
        data: [106, 107, 111, 133, 221, 767, 1766, 502, 635, 809, 947, 1402, 3634]
      }, {
        name: 'Office',
        data: [163, 203, 276, 408, 547, 729, 628, 502, 635, 809, 947, 1402, 3634]
      }]
  }

  cards() {
    return [72,54,32,60,10];
  }

  piecharts() {
    return [{
      name: 'Home',
      y: 61,
      sliced: true,
      selected: true
    }, {
      name: 'Client',
      y: 11
    }, {
      name: 'Office',
      y: 28
    }]
  }


  logs() {
    this.authService.getLoginLogs()
      .subscribe((resData: any) => {
        console.log("Array in Logs Comp ", resData);
        resData.result.map(log => {
          this.loginLogs = JSON.parse(log).message
          const logObj: string[] = JSON.parse(log).message.split('-');
          this.logArray.push({
            action: logObj[0],
            date: logObj[1],
            time: logObj[2],
            from: logObj[3],
            empid: logObj[4],
            uname: logObj[5],
            name: logObj[6]
          });
        });
        console.log(this.logArray);
        this.calcPieData();
        this.logSubject.next(this.logArray);
      });

  }

  calcPieData() {
    let office: number =0, client: number = 0, home = 0;
    this.logArray.forEach(log => {
      if(log.from === 'Home')
        home++;
      else if(log.from === 'Office')
        office++;
      else
        client++;
    })
    console.log(office,client,home);
    this.pieSubject.next([{name: 'Office', y: office}, {name: 'Client' ,y: client}, {name: 'Home', y: home}])
  }

  getPieSubjectasObs() {
    return this.pieSubject.asObservable();
  }

  getLogSubjectasObs() {
    return this.logSubject.asObservable();
  }

}
