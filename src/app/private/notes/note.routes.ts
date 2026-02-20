import { Routes } from '@angular/router';
import {NotesTable} from './pages/notes-table/notes-table';

export const noteRoutes: Routes = [
    {
        path: '',
        component: NotesTable
    }
];
