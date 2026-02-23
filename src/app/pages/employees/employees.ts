import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department_id: number;
  department_name?: string;
}

interface Department {
  id: number;
  name: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrls: ['./employees.css']
})
export class EmployeesComponent implements OnInit {

  employees = signal<Employee[]>([]);
  departments = signal<Department[]>([]);
  showForm = signal<boolean>(false);

  newEmployee = {
    name: '',
    email: '',
    phone: '',
    department_id: 0
  };

  ngOnInit(): void {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      window.location.href = '/';
      return;
    }

    this.getDepartments();
  }

  // ======================
  // GET DEPARTMENTS
  // ======================
  getDepartments() {
    fetch('http://localhost:3000/api/departments')
      .then(res => res.json())
      .then((depts: Department[]) => {
        this.departments.set(depts);
        this.refreshEmployees();
      })
      .catch(err => console.error(err));
  }

  // ======================
  // GET EMPLOYEES
  // ======================
  refreshEmployees() {
    fetch('http://localhost:3000/api/employees')
      .then(res => res.json())
      .then((emps: Employee[]) => {
        this.employees.set(emps);
      })
      .catch(err => console.error(err));
  }

  // ======================
  // ADD EMPLOYEE
  // ======================
  addEmployee(): void {

    if (this.newEmployee.department_id === 0) {
      alert('Please select department');
      return;
    }

    fetch('http://localhost:3000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.newEmployee)
    })
      .then(res => res.json())
      .then(() => {
        alert('Employee Added Successfully');
        this.refreshEmployees();
        this.showForm.set(false);

        this.newEmployee = {
          name: '',
          email: '',
          phone: '',
          department_id: 0
        };
      })
      .catch(err => console.error(err));
  }

  // ======================
  // DELETE EMPLOYEE
  // ======================
  deleteEmployee(id: number): void {

    if (!confirm('Are you sure?')) return;

    fetch(`http://localhost:3000/api/employees/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        this.refreshEmployees();
      })
      .catch(err => console.error(err));
  }
}