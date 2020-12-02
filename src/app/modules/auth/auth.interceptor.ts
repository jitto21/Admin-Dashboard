import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    intercept(req: import("@angular/common/http").HttpRequest<any>, next: import("@angular/common/http").HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
        console.log("Intercepting every requests ==> ", req.url);
        const token = this.authService.getToken();
        if(!token) {
            return next.handle(req);
        }
        const maxTimeout = this.authService.getMaxTimeout();
        if(maxTimeout) {
            this.authService.idleAutoLogout(600000);
            console.log(`Added ${600000/60000} minute`);
        }
        const modiURL = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(modiURL);
    }
}
