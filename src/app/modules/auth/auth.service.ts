import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { AuthModel } from './auth.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users = [
    {
      username: 'admin',
      password: 'admin',
      name: 'Jeff Manathara',
      access: { users: true, location: true, survey: true, screen1: true, screen2: true, screen3: true, screen4: true, screen5: true, screen6: true }
    },
    {
      username: 'jitto',
      password: '123',
      name: 'Jitto Palathra',
      access: { users: false, location: true, survey: false, screen1: false, screen2: true, screen3: false, screen4: false, screen5: true, screen6: false }
    },
    {
      username: 'jiju',
      password: '1234',
      name: 'Jiju Manathara',
      access: { users: false, location: true, survey: false, screen1: false, screen2: true, screen3: false, screen4: false, screen5: true, screen6: false }
    }
  ];
  private token: string;
  private logoutTimer;
  private idleLogoutTimer;
  private user: {
    name: string,
    access: { [key: string]: boolean },
    email: string
  };
  private maxTimeout: number;
  private signinFrom: string;

  private loginSubject = new Subject<any>();

  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog) { }

  getToken() {
    return this.token;
  }

  getLoggedInUserInfo() {
    return this.user;
  }

  getMaxTimeout() {
    return this.maxTimeout;
  }

  getLoginSubject() {
    return this.loginSubject.asObservable();
  }

  getUsers() {
    return this.http.get<{ message: string, users: AuthModel[] }>('http://localhost:3000/auth/fetchUsers')
      .pipe(map(res => {
        return res.users.map(user => {
          return {
            id: user._id,
            fname: user.fname,
            mname: user.mname,
            lname: user.lname,
            empid: user.empid,
            email: user.email,
            uname: user.uname,
            phone: user.phone,
            altPhone: user.altPhone,
            designation: user.designation,
            doj: user.doj,
            access: user.access,
            gender: user.gender
          }
        })
      }));
  }

  changePermissions(permissionsArr) {
    console.log(permissionsArr);
    this.http.post<{ message: string }>('http://localhost:3000/auth/changePermissions', permissionsArr)
      .subscribe(resData => {
        console.log(resData);
        alert(resData.message);
        this.getUsers();
      });
  }

  signup(signupObj) {
    console.log(signupObj);
    return this.http.post<{ message: string }>('http://localhost:3000/auth/signup', signupObj);
  }

  login(uname: string, pass: string, signinFrom: string) {
    let user = {
      uname: uname,
      pass: pass,
      signinFrom: signinFrom
    }
    this.http.post<{
      messsage: string,
      token: string,
      userInfo: {
        name: string,
        access: { [key: string]: boolean },
        email: string
      }
      expiresIn: number,
      maxTimeout: number
    }>('http://localhost:3000/auth/login', user)
      .subscribe(resData => {
        this.token = resData.token;
        let expiresIn = resData.expiresIn;
        this.user = {
          access: resData.userInfo.access,
          name: resData.userInfo.name,
          email: resData.userInfo.email
        }
        this.signinFrom = signinFrom;
        this.maxTimeout = resData.maxTimeout
        console.log("Logged IN ==> ", this.user);
        if (this.token) {
          this.loginSubject.next(this.user);
          this.autoLogout(expiresIn * 1000);
          const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
          this.saveAuthData(this.token, expirationDate, this.user, this.maxTimeout, signinFrom);
          this.router.navigate(['/'])
        }
      })
  }

  autoLogin() {
    const user = this.getAuthData();
    const expiresIn = user.expirationDate.getTime() - new Date().getTime();
    if (!user || expiresIn <= 0) {
      console.log("user is NOT in sessionStorage or session expired");
      return;
    }
    console.log("user is still in sessionStorage=> ", user);
    console.log("New expiry time in minutes", expiresIn / 60000);
    this.autoLogout(expiresIn);
    this.token = user.token;
    this.maxTimeout = user.maxTimeout;
    this.user = {
      access: user.user.access,
      name: user.user.name,
      email: user.user.email
    }
    console.log(this.user);
    this.loginSubject.next(this.user);
    this.signinFrom = user.from;
  }

  autoLogout(expiresIn: number) { //Absolute Timeout
    this.logoutTimer = setTimeout(() => {
      this.logout("Absolute Timer");
    }, expiresIn)
  }

  idleAutoLogout(expiresIn: number) { //Inactive Timeout
    console.log("Logging out in " + expiresIn / 60000 + "minutes");
    if (this.idleLogoutTimer) { //clears if any timeout is existing
      console.log("Timeout exists; Clearing It")
      clearTimeout(this.idleLogoutTimer);
    }
    if (+this.maxTimeout < 0) { //exceeds maximum no: of inactive timeouts
      console.log(this.maxTimeout, "timeouts left");
      this.logout("Timeout");
      return;
    }
    this.idleLogoutTimer = setTimeout(() => {
      console.log("Inactivity time limit reached");
      const modalRef = this.dialog.open(ModalComponent,{
        data: {maxTimeout: this.maxTimeout}
      });
      console.log("maxTimeout in Auth Service ==> ", this.maxTimeout);
      modalRef.componentInstance.data.maxTimeout = this.maxTimeout;

      modalRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result === "CANCEL") {
          sessionStorage.setItem('maxTimeout', (--this.maxTimeout).toString());
          this.idleAutoLogout(60000);
          return;
        } else {
          this.logout("other than CANCEL");
          return;
        }
      })
    }, expiresIn - 10000)
  }



  logout(from: string) {
    console.log("logout called ==> ", from);
    this.maxTimeout = null;
    //clearing both timeouts

    clearTimeout(this.logoutTimer);
    clearTimeout(this.idleLogoutTimer);
    let logoutUser = {
      name: this.user.name,
      from: this.signinFrom
    }
    this.http.post<{ message: string }>('http://localhost:3000/auth/logout', logoutUser)
      .subscribe(resData => {
        console.log(resData.message);
        this.user = null;
        this.token = null;
        this.router.navigate(['/auth']);
        this.loginSubject.next(this.user);
        this.deleteAuthData();
      })
  }

  saveAuthData(token: string, expirationDate: Date, user: any, maxTimeout: number, from: string) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('expirationDate', expirationDate.toISOString());
    sessionStorage.setItem('from', from);
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('maxTimeout', maxTimeout.toString());
  }

  deleteAuthData() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expirationDate');
    sessionStorage.removeItem('from');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('maxTimeout');
  }

  getAuthData() {
    let authUser;
    const token = sessionStorage.getItem("token");
    const expirationDate = sessionStorage.getItem('expirationDate');
    const from = sessionStorage.getItem("from");
    const user = JSON.parse(sessionStorage.getItem("user"));
    const maxTimeout = +sessionStorage.getItem("maxTimeout");
    if (!token || !expirationDate) {
      return;
    }
    authUser = { token: token, expirationDate: new Date(expirationDate), user, maxTimeout: maxTimeout, from }
    return authUser;
  }

  getLoginLogs() {
    var logArray: any[] = [];
    return this.http.get<{ message: string, result: any }>('http://localhost:3000/log/fetch');
  }
}
