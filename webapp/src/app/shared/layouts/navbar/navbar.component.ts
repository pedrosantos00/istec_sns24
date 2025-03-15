import { JWTTokenService } from './../../services/jwt-token/jwt-token.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroUserCircle, heroUser } from '@ng-icons/heroicons/outline';
import { ButtonComponent } from '../../components/button/button.component';
import { UserPictureService } from '../../services/userPictureProfile/user-picture-service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, NgIcon, RouterLink, ButtonComponent],
  templateUrl: './navbar.component.html',
  viewProviders: [
    provideIcons({
      heroUserCircle,
      heroUser,
    }),
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLogged?: boolean;
  profilePicture?: string;

  constructor(
    private router: Router,
    private jwtService: JWTTokenService,
    private userProfileService: UserPictureService
  ) {}

  ngOnInit(): void {
    this.isLogged = this.jwtService.isLoggedIn();

    this.userProfileService.currentPicture$.subscribe(picture => {
      this.profilePicture = picture;
    });
  }

  get profileIconClick() {
    return this.router.url.includes('dashboard');
  }
}
