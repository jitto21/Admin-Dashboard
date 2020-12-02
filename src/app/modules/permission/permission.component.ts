import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})

export class PermissionComponent implements OnInit {

  public users = [];

  public dataSource;
  public displayedColumns: string[] = ['position', 'name', 'location', 'survey', 'screen1', 'screen2', 'screen3', 'screen4'];

  permissionsForm: FormGroup;


  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  get usersArray() {
    return this.permissionsForm.get('usersArray') as FormArray;
  }

  ngOnInit(): void {
    this.permissionsForm = this.formBuilder.group({
      usersArray: this.formBuilder.array([])
    });
    this.authService.getUsers()
    .subscribe((resData: any) => {
      this.users = resData;
      console.log(this.users);

      this.users.forEach((user)=> {
        this.usersArray.push(this.formBuilder.group({
          id: this.formBuilder.control(user.id),
          location: this.formBuilder.control(user.access.location),
          survey: this.formBuilder.control(user.access.survey),
          screen1: this.formBuilder.control(user.access.screen1),
          screen2: this.formBuilder.control(user.access.screen2),
          screen3: this.formBuilder.control(user.access.screen3),
          screen4: this.formBuilder.control(user.access.screen4),
          screen5: this.formBuilder.control(user.access.screen5),
          screen6: this.formBuilder.control(user.access.screen6)
        }))
      });
      this.dataSource = this.users;
    })
  }

  onSubmit() {
    console.log(this.permissionsForm.value.usersArray);
    this.authService.changePermissions(this.permissionsForm.value.usersArray);
  }

}

