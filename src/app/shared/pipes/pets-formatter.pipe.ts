import { Pipe, PipeTransform } from '@angular/core';
import { Pet } from '@shared/models/pet.model';


@Pipe({
  name: 'petsFormatter',
  standalone: true
})
export class PetsFormatterPipe implements PipeTransform {

  transform(pets: Pet[] | null | undefined, ...args: unknown[]): string {
    if (!pets || !Array.isArray(pets) || pets.length === 0) {
      return '';
    }

    const petNames = pets.map(pet => pet.name);
    return petNames.join(', ');
  }

}
