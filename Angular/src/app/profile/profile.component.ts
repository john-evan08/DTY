import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { Bill } from '../bill';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user = new User();
  bills: Bill[] = [];
  modeadd = false;
  bill = new Bill();

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


addBill() {
  this.modeadd = true;
}



onSubmit() {
  if (!this.modeadd) {
    return null;
  }
  this.modeadd = false;
  this.authService.addBill(this.bill).subscribe(data => {
    if (data.success) {
      this.messageService.add( data.msg + ': you have successfully added your bill');
      this.ngOnInit();
    } else {
      this.messageService.add( data.msg + ': something went wrong, please edit' );
    }
});
}

deleteBill(bill) {
  console.log(bill);
  this.authService.deleteBill(bill).subscribe(data => {
    console.log(data);
    if (data.success) {
      this.messageService.add( data.msg + ': you have successfully deleted your bill');
      this.ngOnInit();

    } else {
      this.messageService.add( data.msg + ': something went wrong, please edit' );
    }
});
}

  stringify(date) {
    return JSON.stringify(date);
  }

}



