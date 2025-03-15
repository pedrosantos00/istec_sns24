import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserPictureService } from './shared/services/userPictureProfile/user-picture-service';
import { UserService } from './shared/services/user/user.service';
import { JWTTokenService } from './shared/services/jwt-token/jwt-token.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private pictureService: UserPictureService,
    private jwtServie: JWTTokenService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (!this.jwtServie.isLoggedIn()) return;

    this.userService.getUser().subscribe((user) => {
      this.pictureService.updatePicture(user.data.profilePicture);
    });
  }

  title = 'WebApp';
}
