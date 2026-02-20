import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'main',
    loadChildren: () => import('./public/main/main.routes').then((m) => m.mainRoutes),
  },
  {
    path: 'notes',
    loadChildren: () => import('./private/notes/note.routes').then((m) => m.noteRoutes),
  },
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];
