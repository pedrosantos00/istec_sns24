import { CommonModule } from '@angular/common';
import { Component, ContentChildren, contentChildren, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/layouts/navbar/navbar.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCalendar, heroCalendarDays, heroChatBubbleOvalLeft, heroClipboardDocument, heroClipboardDocumentCheck, heroClipboardDocumentList, heroDevicePhoneMobile, heroDocumentText, heroHeart, heroIdentification, heroPhone, heroUserCircle, heroUserGroup } from '@ng-icons/heroicons/outline';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FooterComponent } from '../../shared/layouts/footer/footer.component';
import { JWTTokenService } from '../../shared/services/jwt-token/jwt-token.service';

@Component({
    selector: 'app-landing-page',
    imports: [CommonModule, NavbarComponent, NgIcon, RouterModule, ButtonComponent, FooterComponent],
    templateUrl: './landing-page.component.html',
    viewProviders: [
        provideIcons({
            heroCalendar,
            heroClipboardDocumentList,
            heroHeart,
            heroPhone,
            heroDevicePhoneMobile,
            heroUserGroup,
            heroChatBubbleOvalLeft,
            heroIdentification,
            heroDocumentText,
            heroClipboardDocumentCheck,
            heroCalendarDays,
        }),
    ],
    styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  constructor(private jwtService : JWTTokenService) { }
  isLogged?: boolean;

  ngOnInit(): void {
    this.isLogged = this.jwtService.isLoggedIn();
  }


}
