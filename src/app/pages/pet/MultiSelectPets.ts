import { Component, OnInit } from '@angular/core';
import { PetService, Pet } from '../service/pet.service';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'multi-select-pets',
  imports: [
    FormsModule,
    MultiSelectModule,
    ButtonModule
  ],
  template: `
    <p-multiselect [options]="pets" [(ngModel)]="selectedPets" placeholder="Select Countries" optionLabel="name" styleClass="w-full !p-2 !rounded-2xl" display="chip">
        <ng-template let-pet #item>
            <div class="flex items-center gap-2">
                <div>{{ pet.name }}</div>
            </div>
        </ng-template>
        <ng-template #dropdownicon>
            <i class="pi pi-chevron-down"></i>
        </ng-template>
    </p-multiselect>
  `,
})
export class MultiSelectPets implements OnInit {
  pets!: Pet[];
  selectedPets!: Pet[];

  constructor(private petService: PetService) { }

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.petService.getPets().subscribe(({ data }: { data: Pet[] }) => {
      this.pets = data;
    });
  }

  // onSelectPet(pet: Pet): void {
  //   if (!this.selectedPets.includes(pet)) {
  //     this.selectedPets.push(pet);
  //   }
  // }

  // onDeselectPet(pet: Pet): void {
  //   this.selectedPets = this.selectedPets.filter(p => p !== pet);
  // }
}
