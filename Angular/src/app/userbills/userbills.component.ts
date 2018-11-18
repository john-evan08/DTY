import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { ProfileComponent } from '../profile/profile.component';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { Bill } from '../bill';
import { Profile } from 'selenium-webdriver/firefox';

@Component({
  selector: 'app-userbills',
  templateUrl: './userbills.component.html',
  styleUrls: ['./userbills.component.scss']
})
export class UserbillsComponent implements OnInit {

  @Input() bills: Bill[] ;
  bill = new Bill();
  modeadd = false;

  constructor(private messageService: MessageService,
    public authService: AuthService,
    private router: Router,
    private profile: ProfileComponent) { }

  ngOnInit() {
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
        this.profile.ngOnInit();
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
        this.profile.ngOnInit();
      } else {
        this.messageService.add( data.msg + ': something went wrong, please edit' );
      }
  });
  }

  stringify(date) {
    return JSON.stringify(date);
  }

}
