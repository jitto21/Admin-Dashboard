import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();

  public user: any = null

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUserInfo();
    this.authService.getLoginSubject().subscribe(user => {
      this.user = user;
      console.log("Header logged IN ==> ",this.user);
    })
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      )
    }, 300);
  }

  onLogout() {
    this.authService.logout('header');
  }

}
