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
  status?: string;

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

  activeMenu = signal<number | null>(null);
  editingEmployeeId = signal<number | null>(null);

  newEmployee = {

    name: '',
    email: '',
    phone: '',
    department_id: 0,
    status: 'Active'

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
  // TOGGLE MENU
  // ======================
  toggleMenu(id: number) {

    this.activeMenu.set(
      this.activeMenu() === id ? null : id
    );

  }


  // ======================
  // EDIT EMPLOYEE
  // ======================
  editEmployee(emp: Employee) {

    this.newEmployee = {

      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      department_id: emp.department_id,
      status: emp.status || 'Active'

    };

    this.editingEmployeeId.set(emp.id);

    this.showForm.set(true);

    this.activeMenu.set(null);

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

        this.employees.set(
          emps.map(emp => ({
            ...emp,
            status: emp.status || 'Active'
          }))
        );

      })

      .catch(err => console.error(err));

  }


  // ======================
  // ADD OR UPDATE EMPLOYEE
  // ======================
  addEmployee(): void {

    if (this.newEmployee.department_id === 0) {

      alert('Please select department');
      return;

    }

    const url = this.editingEmployeeId()
      ? `http://localhost:3000/api/employees/${this.editingEmployeeId()}`
      : `http://localhost:3000/api/employees`;

    const method = this.editingEmployeeId()
      ? 'PUT'
      : 'POST';

    fetch(url, {

      method: method,

      headers: {

        'Content-Type': 'application/json'

      },

      body: JSON.stringify(this.newEmployee)

    })
      .then(res => res.json())
      .then(() => {

        alert(
          this.editingEmployeeId()
            ? 'Employee Updated Successfully'
            : 'Employee Added Successfully'
        );

        this.resetForm();

        this.refreshEmployees();

      })
      .catch(err => console.error(err));

  }


  // ======================
  // DELETE EMPLOYEE
  // ======================
  deleteEmployee(id: number): void {

    if (!confirm('Are you sure you want to delete this employee?'))
      return;

    fetch(`http://localhost:3000/api/employees/${id}`, {

      method: 'DELETE'

    })
      .then(res => res.json())
      .then(() => {

        alert('Employee Deleted Successfully');

        this.refreshEmployees();

        this.activeMenu.set(null);

      })
      .catch(err => console.error(err));

  }


  // ======================
  // TOGGLE STATUS
  // ======================
  toggleStatus(emp: Employee) {

    const newStatus =
      emp.status === 'Active'
        ? 'Inactive'
        : 'Active';

    fetch(`http://localhost:3000/api/employees/${emp.id}`, {

      method: 'PUT',

      headers: {

        'Content-Type': 'application/json'

      },

      body: JSON.stringify({

        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        department_id: emp.department_id,
        status: newStatus

      })

    })
      .then(() => {

        this.refreshEmployees();

        this.activeMenu.set(null);

      })
      .catch(err => console.error(err));

  }


  // ======================
  // RESET FORM
  // ======================
  resetForm() {

    this.newEmployee = {

      name: '',
      email: '',
      phone: '',
      department_id: 0,
      status: 'Active'

    };

    this.editingEmployeeId.set(null);

    this.showForm.set(false);

  }

}