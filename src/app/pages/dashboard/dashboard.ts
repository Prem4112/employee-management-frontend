import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

interface Employee {
  id: number;
  status?: string;
  department_name?: string;
  created_at?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  totalEmployees = signal<number>(0);
  activeEmployees = signal<number>(0);
  totalDepartments = signal<number>(0);

  recentEmployees = signal<Employee[]>([]);
  latestEmployee = signal<Employee | null>(null);

  constructor(private router: Router) {}

  ngOnInit(): void {

    const admin = localStorage.getItem('admin');

    if (!admin) {
      this.router.navigate(['/']);
      return;
    }

    this.loadAllDashboardData();
  }

  // =============================
  // LOAD ALL DATA
  // =============================
  loadAllDashboardData() {

    fetch('http://localhost:3000/api/employees')
      .then(res => res.json())
      .then((data: Employee[]) => {

        console.log("Employee Data:", data);

        // =============================
        // COUNTS
        // =============================

        this.totalEmployees.set(data.length);

        const active = data.filter(emp =>
          emp.status?.toLowerCase().trim() === 'active'
        ).length;

        const inactive = data.length - active;

        this.activeEmployees.set(active);

        // =============================
        // SORT BY DATE
        // =============================

        const sorted = [...data].sort((a, b) =>
          new Date(b.created_at || '').getTime() -
          new Date(a.created_at || '').getTime()
        );

        this.recentEmployees.set(sorted.slice(0, 5));
        this.latestEmployee.set(sorted[0] || null);

        // =============================
        // CHARTS
        // =============================

        this.createDepartmentChart(data);
        this.createStatusChart(active, inactive);
        this.createGrowthChart(data);

      })
      .catch(err => console.error(err));


    // =============================
    // DEPARTMENT COUNT
    // =============================

    fetch('http://localhost:3000/api/departments')
      .then(res => res.json())
      .then(data => {
        this.totalDepartments.set(data.length);
      });

  }

  // =============================
  // DEPARTMENT CHART
  // =============================
  createDepartmentChart(data: Employee[]) {

    const counts: any = {};

    data.forEach(emp => {

      const dept = emp.department_name || 'Unknown';

      counts[dept] = (counts[dept] || 0) + 1;

    });

    new Chart('departmentChart', {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: [{
          label: 'Employees',
          data: Object.values(counts),
          backgroundColor: [
            '#6366f1',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
            '#06b6d4'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });

  }

  // =============================
  // STATUS CHART
  // =============================
  createStatusChart(active: number, inactive: number) {

    new Chart('statusChart', {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [active, inactive],
          backgroundColor: [
            '#10b981',
            '#ef4444'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });

  }

  // =============================
  // REAL GROWTH CHART (FIXED)
  // =============================
  createGrowthChart(data: Employee[]) {

    const monthlyCounts: any = {};

    data.forEach(emp => {

      if (!emp.created_at) return;

      const date = new Date(emp.created_at);

      const key =
        date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0');

      monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;

    });

    const labels = Object.keys(monthlyCounts);
    const values = Object.values(monthlyCounts);

    new Chart('growthChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Employee Growth',
          data: values,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true
      }
    });

  }

  // =============================
  // NAVIGATION
  // =============================
  goToEmployees() {
    this.router.navigate(['/layout/employees']);
  }
  goToDepartment() {
    this.router.navigate(['/layout/departments']);
  }

}