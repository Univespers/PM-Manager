import { Routes } from '@angular/router';

import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [

    // Home page
    { path: "", component: HomeComponent },

    // Not found page
    { path: "**", component: NotFoundComponent }

];
