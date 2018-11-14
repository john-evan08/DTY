import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user1: Object;
  user = new User();
  Str: string;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {

    this.authService.getProfile().subscribe(profile => {
      this.user1 = profile['user'];
      this.user.name = this.user1['name'];
      this.user.username = this.user1['username'];
      this.user.email = this.user1['email'];
      this.user.password = this.user1['password'];
      },
      err => {
        console.log(err);
        this.messageService.add('unauthorized to login');
        return false;
      });
  }

}
