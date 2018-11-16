import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { ValidateService } from '../validate.service';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user = new User();
  constructor(
    private validateService: ValidateService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router) { }

  submitted = false;

  ngOnInit() {
  }

  onSubmit() {
    this.messageService.add(this.user.username);

    // Required Fields
    if (!this.validateService.validateRegister(this.user)) {
    this.messageService.add('Please fill in all fields');
    this.submitted = false;

    // E-mail valid ?
  } else if (!this.validateService.validateEmail(this.user.email)) {
      this.messageService.add('wrong e-mail');
      this.submitted = false;

    // RegisterUser
    } else {
      this.submitted = true;
      this.authService.registerUser(this.user).subscribe(data => {
        if (data.success) {
          this.messageService.add( data.msg + ': you are registered and ready to login');

        } else {
          this.messageService.add( data.msg + ': something went wrong, please edit');


        }
      });
    }
  }

   newUser() {
    this.user = new User();
  }
}
