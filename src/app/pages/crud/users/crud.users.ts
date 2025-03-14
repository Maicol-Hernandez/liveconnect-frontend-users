import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
import { ChipModule } from 'primeng/chip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Message } from 'primeng/message';
import { AutoFocusModule } from 'primeng/autofocus';
import { ConfirmationService, MessageService } from 'primeng/api';

import { CrudUserService } from '../../service/crud.user.service'
import { PetService } from '../../service/pet.service';
import { User, UserUpdateResponse } from '@shared/models/user.model';
import { Pet } from '@shared/models/pet.model';
// import { PetsFormatterPipe } from '@shared/pipes/pets-formatter.pipe';

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
    ReactiveFormsModule,
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
    ChipModule,
    FloatLabelModule,
    ConfirmDialogModule,
    Message,
    AutoFocusModule
    // PetsFormatterPipe
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

  userForm: FormGroup

  constructor(
    private crudUserService: CrudUserService,
    private petService: PetService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      // email: ['', Validators.required],
      // password: ['', Validators.required],
      pets: [[], [Validators.required]]
    })
  }

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
    this.userForm.reset();
  }

  editUser(user: User): void {
    this.user = { ...user };
    this.userForm.patchValue({
      name: user.name,
      pets: user.pets?.map(p => p.id) || []
    });
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

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.userForm.value,
      id: this.user.id
    }

    this.crudUserService.updateUser(formData).subscribe({
      next: (updatedUser: UserUpdateResponse) => {
        this.updateUserList(updatedUser.data);
        this.showSuccessMessage('User Updated');
      },
      error: this.handleError('update')
    });

    this.userDialog = false;
  }

  private updateUserList(updatedUser: User): void {
    this.users.update(users =>
      users.map(u => u.id === updatedUser.id ? updatedUser : u)
    )
  }

  private showSuccessMessage(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: detail,
      life: 3000
    })
  }

  private handleError(action: string) {
    return (error: any) => {
      console.error(`Error ${action} user:`, error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Unable to ${action} user`,
        life: 3000
      });
    }
  }

  get name() {
    return this.userForm.get('name');
  }

  get pets() {
    return this.userForm.get('pets');
  }
}
