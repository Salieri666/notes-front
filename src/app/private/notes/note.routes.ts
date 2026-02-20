import { Routes } from '@angular/router';
import {NotesTable} from './notes-table/notes-table';

export const noteRoutes: Routes = [
    {
        path: 'notes',
        component: NotesTable
    }
];
