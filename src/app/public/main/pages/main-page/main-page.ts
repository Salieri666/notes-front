import {Component, inject, signal, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage implements OnInit {
  // Инжектим напрямую
  private readonly keycloak = inject(Keycloak);

  isLoggedIn = signal(false);
  userName = signal('');

  ngOnInit(): void {
    this.initUser();
  }

  private async initUser(): Promise<void> {
    this.isLoggedIn.set(this.keycloak.authenticated);

    if (this.isLoggedIn()) {
      const profile = await this.keycloak.loadUserProfile();
      this.userName.set(profile.username || 'Пользователь');
    }
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    // Указываем URL возврата после разлогина
    this.keycloak.logout({ redirectUri: globalThis.location.origin });
  }
}
