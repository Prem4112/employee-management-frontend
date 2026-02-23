import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.html',
  styleUrls: ['./departments.css']
})
export class Departments implements OnInit {

  departments = signal<any[]>([]);
  showForm = signal(false);   // ✅ controls form visibility
  newDepartment = '';

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    fetch('http://localhost:3000/api/departments')
      .then(res => res.json())
      .then(data => this.departments.set(data))
      .catch(err => console.error(err));
  }

  openForm() {
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.newDepartment = '';
  }

  addDepartment() {

    if (!this.newDepartment.trim()) return;

    fetch('http://localhost:3000/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: this.newDepartment })
    })
    .then(res => res.json())
    .then(() => {

      this.getDepartments();

      // ✅ close form automatically
      this.closeForm();

    })
    .catch(err => console.error(err));
  }

  deleteDepartment(id: number) {

    fetch(`http://localhost:3000/api/departments/${id}`, {
      method: 'DELETE'
    })
    .then(() => this.getDepartments())
    .catch(err => console.error(err));
  }

}
