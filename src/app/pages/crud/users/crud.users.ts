import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, signal, ViewChild } from '@angular/core';

import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect'
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Message } from 'primeng/message';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CrudUserService } from '../../service/crud.user.service'
import { PetService } from '../../service/pet.service';
import { User } from '@shared/models/user.model';
import { Pet } from '@shared/models/pet.model';
import { PetsFormatterPipe } from '@shared/pipes/pets-formatter.pipe';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-crud-users',
  templateUrl: './crud.users.html',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    MultiSelectModule,
    IconFieldModule,
    ConfirmDialogModule,
    Message,
    PetsFormatterPipe
  ],
  providers: [ConfirmationService, MessageService, CrudUserService]
})
export class CrudUsers implements OnInit {
  userDialog: boolean = false

  users = signal<User[]>([]);

  user!: User;

  selectedUsers!: User[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  dataPets!: Pet[];

  selectedPets!: Pet[];

  constructor(
    private crudUserService: CrudUserService,
    private petService: PetService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadPets();
  }

  loadPets(): void {
    this.petService.getPets().subscribe({
      next: (response) => {
        this.dataPets = response.data;
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load pets',
          life: 3000
        })
      }
    });
  }

  loadUsers(): void {
    this.crudUserService.getUsers().subscribe({
      next: (response) => {
        this.users.set(response.data);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users',
          life: 3000
        })
      }
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'created_at', header: 'Created At' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(user: User): void {
    this.user = { ...user };
    this.userDialog = true;
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  deleteUser(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the user ${user.name || user.email}?`,
      header: 'Confirm deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.crudUserService.deleteUser(user.id).subscribe({
          next: () => {
            this.users.update(value => value.filter(val => val.id !== user.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to delete user',
              life: 3000
            });
          }
        });
      }
    });
  }

  saveUser() {
    this.submitted = true;

    if (this.user.name?.trim()) {
      if (this.user.id) {
        this.crudUserService.updateUser(this.user).subscribe({
          next: () => {
            this.users.update(users => {
              const index = users.findIndex(u => u.id === this.user.id);
              users[index] = this.user;
              return [...users];
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Updated',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error updating user:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to update user',
              life: 3000
            });
          }
        });
      } else {
        this.crudUserService.createUser(this.user).subscribe({
          next: (newUser) => {
            this.users.update(users => [...users, newUser]);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Created',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error creating user:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to create user',
              life: 3000
            });
          }
        });
      }

      this.userDialog = false;
      this.user = {};
    }
  }
}
