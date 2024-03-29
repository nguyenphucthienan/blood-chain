import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParamsBuilder } from 'src/app/utils/params-builder';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

  private readonly loginUrl = `${environment.apiUrl}/auth/login`;
  private readonly checkUsernameUrl = `${environment.apiUrl}/auth/check-username`;
  private readonly checkIdCardNumberUrl = `${environment.apiUrl}/auth/check-id-card-number`;
  private readonly checkEmailUrl = `${environment.apiUrl}/auth/check-email`;
  private readonly registerUrl = `${environment.apiUrl}/auth/register`;
  private readonly meUrl = `${environment.apiUrl}/auth/me`;
  private readonly userInfoOnBlockchainUrl = `${environment.apiUrl}/auth/me/user-info`;
  private readonly pointHistoriesOnBlockchainUrl = `${environment.apiUrl}/auth/me/point-histories`;
  private readonly changePasswordUrl = `${environment.apiUrl}/auth/me/password`;

  private jwtHelper = new JwtHelperService();
  private decodedToken: any;
  private decodedTokenSubject = new BehaviorSubject(this.decodedToken);
  decodedToken$ = this.decodedTokenSubject.asObservable();

  constructor(private http: HttpClient) { }

  readTokenFromStorage() {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem(environment.tokenName.auth);
      this.changeDecodedToken(token);
    } else {
      this.logout();
    }
  }

  isLoggedIn() {
    const token = localStorage.getItem(environment.tokenName.auth);
    return !this.jwtHelper.isTokenExpired(token);
  }

  checkUsernameExists(username: string): Observable<boolean> {
    const params = new ParamsBuilder()
      .setParam('username', username)
      .build();

    return this.http.get<boolean>(this.checkUsernameUrl, { params });
  }

  checkIdCardNumberExists(idCardNumber: string): Observable<boolean> {
    const params = new ParamsBuilder()
      .setParam('idCardNumber', idCardNumber)
      .build();

    return this.http.get<boolean>(this.checkIdCardNumberUrl, { params });
  }

  checkEmailExists(email: string): Observable<boolean> {
    const params = new ParamsBuilder()
      .setParam('email', email)
      .build();

    return this.http.get<boolean>(this.checkEmailUrl, { params });
  }

  register(model: any) {
    return this.http.post(this.registerUrl, model);
  }

  login(model: { username: string, password: string }) {
    return this.http.post(this.loginUrl, model)
      .pipe(
        map(({ accessToken }: any) => {
          if (accessToken) {
            const decodedToken = this.jwtHelper.decodeToken(accessToken);
            const userRoleNames = decodedToken.roles;

            if (userRoleNames.length > 0) {
              localStorage.setItem(environment.tokenName.auth, accessToken);
              this.changeDecodedToken(accessToken);
            } else {
              throw new Error('Not User');
            }
          }
        })
      );
  }

  logout() {
    this.changeDecodedToken(null);
    localStorage.removeItem(environment.tokenName.auth);
  }

  private changeDecodedToken(token: string) {
    this.decodedToken = this.jwtHelper.decodeToken(token);
    this.decodedTokenSubject.next(this.decodedToken);
  }

  getMyUserInfo() {
    const token = localStorage.getItem(environment.tokenName.auth);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(this.meUrl, { headers });
  }

  updateUserInfo(updateModel: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(this.meUrl, updateModel, { headers });
  }

  changeUserPassword(changePasswordModel: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(this.changePasswordUrl, changePasswordModel, { headers });
  }

  getMyUserInfoOnBlockchain() {
    const token = localStorage.getItem(environment.tokenName.auth);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(this.userInfoOnBlockchainUrl, { headers });
  }

  getMyPointHistoriesOnBlockchain() {
    const token = localStorage.getItem(environment.tokenName.auth);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(this.pointHistoriesOnBlockchainUrl, { headers });
  }

  isRoleMatch(allowedRoles: string[]): boolean {
    let result = false;
    if (this.decodedToken) {
      const userRoles = this.decodedToken.roles as Array<string>;
      allowedRoles.forEach(allowedRole => {
        if (userRoles.includes(allowedRole)) {
          result = true;
          return;
        }
      });
    }

    return result;
  }

}
