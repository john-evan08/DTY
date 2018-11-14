import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private messageService: MessageService,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  onLogout(): boolean {
    this.authService.logout();
    this.messageService.add('you are logged out');
    this.router.navigate(['/login']);
    return false;
  }

}
