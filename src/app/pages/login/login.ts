import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  login() {

    fetch('http://localhost:3000/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Invalid credentials');
      }
      return res.json();
    })
    .then(data => {
      // Save login info
      localStorage.setItem('admin', JSON.stringify(data.admin));

      // Navigate to employees page
      this.router.navigate(['/layout/dashboard']);
    })
    .catch(err => {
      this.errorMessage = 'Invalid email or password';
    });

  }

}
