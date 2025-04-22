import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../serviceAdmin/admin.service';
import { User } from 'src/app/models/user';
import { interval, Subject } from 'rxjs';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>();
  statusFilter: string = 'All Status';

  constructor(
              private adminService: AdminService
           
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    //  interval(30000).subscribe(() => { // Toutes les 30 secondes
    //  this.loadUsers();
    //});
  }
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value.trim().toLowerCase());
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.firstname.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        user.lastname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'All Status' || 
        (this.statusFilter === 'Active' ? user.enabled : !user.enabled);
      
      return matchesSearch && matchesStatus;
    });
  }
  toggleUserStatus(user: User): void {
    const newStatus = !user.enabled;
    this.adminService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.enabled = newStatus;
        // Optional: Show success message
      },
      error: (err) => {
        console.error('Error updating user status', err);
        // Optional: Show error message
      }
    });
  }

  toggleAccountLock(user: User): void {
    const newLockStatus = !user.accountLocked;
    this.adminService.updateAccountLockStatus(user.id, newLockStatus).subscribe({
      next: () => {
        user.accountLocked = newLockStatus;
        // Optional: Show success message
      },
      error: (err) => {
        console.error('Error updating account lock status', err);
        // Optional: Show error message
      }
    });
  }
}