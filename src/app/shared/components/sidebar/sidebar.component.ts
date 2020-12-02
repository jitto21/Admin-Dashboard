import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public user: any = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUserInfo();
    this.authService.getLoginSubject().subscribe(user => {
      this.user = user;
      console.log("Sidebar ==> ",this.user);
    });
  }

}
