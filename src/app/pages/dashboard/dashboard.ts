import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  totalEmployees = signal<number>(0);

  constructor(private router: Router) {}

  ngOnInit(): void {

    // 🔒 Protect Dashboard
    const admin = localStorage.getItem('admin');
    if (!admin) {
      this.router.navigate(['/']);
      return;
    }

    this.loadEmployeeCount();
  }

  loadEmployeeCount() {
 fetch('http://localhost:3000/api/employees')

    .then(res => res.json())
    .then((data) => {
      console.log(data);
      this.totalEmployees.set(data.length);
    })
    .catch(err => console.error(err));
}



 goToEmployees() {
    this.router.navigate(['/layout/employees']); 
  }

}
