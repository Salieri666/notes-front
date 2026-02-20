import { Routes } from '@angular/router';

import {MainPageComponent} from './pages/main/main-page.component';


export const mainRoutes: Routes = [
    {
        path: '',
        component: MainPageComponent,
        /*children: [
            {
                path: '',
                component: ShowroomComponent,
            },
            {
                path: 'characters',
                loadChildren: () => import('../../features/characters/characters.routes').then((m) => m.charactersRouting),
            },
            {
                path: 'locations',
                loadChildren: () => import('../../features/locations/locations.routes').then((m) => m.locationsRouting),
            },
            {
                path: 'episodes',
                loadChildren: () => import('../../features/episodes/episodes.routes').then((m) => m.episodesRouting),
            },
        ],*/
    },
];
