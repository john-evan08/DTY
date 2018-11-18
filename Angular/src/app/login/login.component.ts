import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = new User();

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router) { }

  submitted = false;

  ngOnInit() {
  }

  onLogin() {
    const user2 = {
      username: this.user.username,
      password: this.user.password
    };

    this.messageService.add(this.user.username);
    this.authService.authenticateUser(user2).subscribe(data => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.messageService.add('login succeeded');
        this.router.navigate(['/dashboard']);
      } else {
        this.messageService.add(data.msg + ': please retry or register');
        this.router.navigate(['/login']);
      }

    });
  }


  newUser() {
    this.user = new User();
  }
}
