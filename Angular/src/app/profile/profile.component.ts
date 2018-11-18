import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { Bill } from '../bill';
import { UserbillsComponent } from '../userbills/userbills.component';
import { UserlistComponent } from '../userlist/userlist.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  bills: Bill[] = [];
  user = new User();

  constructor(
    private messageService: MessageService,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit() {

    this.authService.getProfile().subscribe(profile => {
      this.user = profile['user'];
      this.bills = this.user['bills'];
      },
      err => {
        this.messageService.add('cannot login');
        return false;
      });
  }
}


