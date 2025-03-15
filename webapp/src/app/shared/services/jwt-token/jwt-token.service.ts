import { Injectable } from '@angular/core';
import { de } from '@faker-js/faker/.';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  name?: string;
  role?: string;
  exp?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class JWTTokenService {
  constructor() {}

  /**
   * Retrieve the token from local storage.
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Store the Ftoken in local storage.
   * @param token The JWT token to store.
   */
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  /**
   * Decode the stored JWT token.
   */
  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      return null;
    }
  }

  /**
   * Retrieve the user role from the decoded token.
   */
  getRole(): string | undefined {
    const decodedToken = this.decodeToken();
    return decodedToken?.role;
  }

  /**
   * Check if the user is a patient.
   */
  isPacient(): boolean {
    return this.getRole() === 'Patient';
  }

  /**
   * Check if the user is logged in and the token is still valid.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const decodedToken = this.decodeToken();
    if (!decodedToken || !decodedToken.exp) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      this.clearToken();
      return false;
    }

    return true;
  }

  getUserId(): string | undefined {
    const decodedToken = this.decodeToken();
    return decodedToken?.sub;
  }



  /**
   * Clear the stored token.
   */
  clearToken(): void {
    localStorage.removeItem('access_token');
  }
}
