import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private loginLogs: any;
  private logArray: any[] = [];
  private officeArr: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  private clientArr: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  private homeArr: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  private pieSubject = new Subject<{name: string, y: number}[]>();
  private bigSubject = new Subject<{name: string, data: number[]}[]>();
  private logSubject = new Subject<any>();
  signupArray: any[] = [];
  signLogs: any;
  private cardSubject = new Subject<{monthArr:number[], userDiff: number, users: number}>();

  constructor(private authService: AuthService) { }

  bigChart() {
    return [{
        name: 'Client',
        data: [502, 635, 809, 947, 1402, 3634, 502, 635, 809, 947, 1402, 3634, 502, 635, 809, 947, 1402, 3634, 502, 635, 809, 947, 1402]
      }, {
        name: 'Home',
        data: [106, 107, 111, 133, 221, 767, 1766, 502, 635, 809, 947, 1402, 3634, 502, 635, 809, 947, 1402, 3634, 502, 635, 809, 947, 1402]
      }, {
        name: 'Office',
        data: [163, 203, 276, 408, 547, 729, 628, 502, 635, 809, 947, 1402, 3634, 502, 635, 809, 947, 1402, 3634, 502, 635, 809, 947, 1402]
      }]
  }

  cards() {
    return [72, 54, 32, 60, 10, 5, 3, 1, 12, 34, 99, 22];
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

  signupLogs() {
    this.authService.getSignupLogs()
      .subscribe((resData: any) => {
        console.log("Signup Array in Logs Comp ", resData);
        resData.result.map(log => {
          console.log('hi');
          this.signLogs = JSON.parse(log).message
          const logObj: string[] = JSON.parse(log).message.split('-');
          this.signupArray.push({
            action: logObj[0],
            date: logObj[1],
            time: logObj[2],
            role: logObj[3],
            empid: logObj[4],
            uname: logObj[5],
            doj: logObj[6],
            name: logObj[7]
          });
        });
        console.log(this.signupArray);
        this.calcCardDataforMonth();
      });
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
        this.calcBigData();
        this.calcPieData();
        this.logSubject.next(this.logArray);
      });

  }

  calcBigData() {
    this.logArray.forEach(log => {
      const time = +log.time.substr(0,2);
      if(log.from === 'Home')
        this.homeArr[time] = ++this.homeArr[time];
      else if(log.from === 'Office')
        this.officeArr[time] = ++this.officeArr[time];
      else
        this.clientArr[time] = ++this.clientArr[time]
    })
    // console.log(this.officeArr);
    // console.log(this.clientArr);
    // console.log(this.homeArr);

    this.bigSubject.next(
      [{
        name: 'Client',
        data: this.clientArr
      }, {
        name: 'Home',
        data: this.homeArr
      }, {
        name: 'Office',
        data: this.officeArr
      }]
    )
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
    // console.log(office,client,home);

    this.pieSubject.next(
      [{name: 'Office', y: office},
      {name: 'Client' ,y: client},
      {name: 'Home', y: home}
    ])
  }

  calcCardDataforWeek() {
  }

  calcCardDataforMonth() {
    const monthArr =  new Array(12).fill(0);
    const thisMonth = new Date().getMonth();
    console.log(monthArr);
    this.signupArray.forEach(log => {
      console.log(+log.date.substr(0,2));
      monthArr[(+log.date.substr(0,2))-1] = ++monthArr[(+log.date.substr(0,2))-1];
    })
    console.log(monthArr);
    const userDiff = (monthArr[thisMonth]) - (monthArr[thisMonth-1]);
    console.log("userDiff ",userDiff)
    this.cardSubject.next({monthArr, userDiff, users: monthArr[thisMonth]});
  }

  getCardSubjectasObs() {
    return this.cardSubject.asObservable();
  }

  getBigSubjectasObs() {
    return this.bigSubject.asObservable();
  }

  getPieSubjectasObs() {
    return this.pieSubject.asObservable();
  }

  getLogSubjectasObs() {
    return this.logSubject.asObservable();
  }

}
