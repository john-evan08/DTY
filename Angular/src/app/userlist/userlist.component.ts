import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { Bill } from '../bill';
import { UserbillsComponent } from '../userbills/userbills.component';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {

  users: User[];
  user: User;
  modebills = false;
  modeallbills = false;
  bills: Bill[];
  allbills = [];

  constructor(
    private messageService: MessageService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    this.authService.getUsers().subscribe(res => {
      if (res['success']) {
      this.users = res.users;
      this.messageService.add(res.msg);
      } else {this.messageService.add(res.msg); }},
      err => {
        this.messageService.add('cannot get Users');
        return false;
      });
  }

  deleteUser(user) {
    this.authService.deleteUser(user).subscribe(res => {
      if (res['success']) {
      this.ngOnInit();
      this.messageService.add(res.msg);
      } else {
        this.messageService.add(res.msg);
      }},
      err => {
        this.messageService.add('cannot delete user');
        return false;
      });

  }

  adminUser(user) {
    this.authService.adminUser(user).subscribe(res => {
      if (res['success']) {
      this.ngOnInit();
      this.messageService.add(res.msg);
      } else {
        this.messageService.add(res.msg);
      }},
      err => {
        this.messageService.add('cannot put user admin');
        return false;
      });

  }

  showBills(user) {
    this.user = user;
    this.modebills = true;
    this.bills = user.bills;
  }

  showAllBills() {
    for (const user of this.users) {
      const bills = user['bills'];
      for ( const bill of bills) {
        this.allbills.push(([bill, user]));
      }
    }
    this.modeallbills = true;

  }

  hideBills(user) {
    this.modebills = false;
  }

  hideAllBills() {
    this.modeallbills = false;
  }

  stringify(date) {
    return JSON.stringify(date);
  }
  lenght(bills) {
    return bills.length;
  }

}


