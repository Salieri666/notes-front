import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Api } from '../../../../_api/api';
import { NoteDtoDto } from '../../../../_api/models/note-dto-dto';
import { deleteNote, getAllNotes } from '../../../../_api/functions';
import { NoteDialog } from '../../component/note-dialog/note-dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-notes-table',
  templateUrl: './notes-table.html',
  styleUrl: './notes-table.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule
  ]
})
export class NotesTable implements OnInit {
  private api = inject(Api);
  private dialog = inject(MatDialog);

  // Сигналы для данных
  dataSource = signal<NoteDtoDto[]>([]);
  totalElements = signal(0);

  // Состояние пагинации в сигналах
  pageSize = signal(10);
  currentPage = signal(0);

  isLoading = signal(false);

  displayedColumns: string[] = ['id', 'title', 'content', 'actions'];

  ngOnInit(): void {
    this.fetchNotes();
  }

  /**
   * Загрузка данных
   */
  async fetchNotes() {
    this.isLoading.set(true); // Включаем лоадер
    try {
      const response = await this.api.invoke(getAllNotes, {
        page: this.currentPage(),
        size: this.pageSize()
      });

      this.dataSource.set(response.content || []);
      this.totalElements.set(response.page?.totalElements || 0);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      this.isLoading.set(false); // Выключаем лоадер в любом случае
    }
  }

  /**
   * Обработка пагинации
   */
  handlePageEvent(e: PageEvent) {
    this.currentPage.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
    this.fetchNotes();
  }

  /**
   * Создание / Редактирование
   */
  openEdit(note?: NoteDtoDto) {
    const dialogRef = this.dialog.open(NoteDialog, {
      width: '500px',
      data: note ? { ...note } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.fetchNotes();
    });
  }

  /**
   * Удаление
   */
  async remove(id: string | undefined) {
    if (!id) return;

    if (confirm('Удалить эту заметку?')) {
      try {
        await this.api.invoke(deleteNote, { id });
        await this.fetchNotes();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  }
}
