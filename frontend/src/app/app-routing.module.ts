import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { universityListComponent } from './university-list/university-list.component';
import { universityDetailsComponent } from './university-details/university-details.component';
import { universityCreateComponent } from './university-create/university-create.component';
import { universityUpdateComponent } from './university-update/university-update.component';
import { MatAutocomplete } from '@angular/material/autocomplete';
// Import the AutocompleteComponent class from the appropriate file

const routes: Routes = [
  { path: 'create', component: universityCreateComponent },
  { path: 'details/:id', component: universityDetailsComponent },
  { path: 'list', component: universityListComponent },
  { path: 'update/:id', component: universityUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
