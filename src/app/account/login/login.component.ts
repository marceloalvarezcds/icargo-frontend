import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isLoading$ = this.loadingService.getLoadingObservable();
  showPassword = false;
  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
  ) { }

  login(): void {
    const formData = new FormData();
    formData.append('username', this.loginForm.controls['username'].value);
    formData.append('password', this.loginForm.controls['password'].value);
    this.authService.login(formData).subscribe(() => {
      this.router.navigate(['/'], { replaceUrl: true });
    });
  }
}
