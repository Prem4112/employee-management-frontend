import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
    constructor(private router: Router) {}

   
      logout() {
    // Clear login data (if using localStorage)
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/']);  // go back to login page
  }
}

