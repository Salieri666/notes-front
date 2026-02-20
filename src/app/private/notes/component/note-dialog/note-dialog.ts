import {Component, inject, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogActions,
  MatDialogContent, MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {saveNote, updateNote} from '../../../../_api/functions';
import {NoteDtoDto} from '../../../../_api/models/note-dto-dto';
import {Api} from '../../../../_api/api';


@Component({
  selector: 'app-note-dialog',
  imports: [
    MatDialogActions,
    MatLabel,
    MatFormField,
    MatDialogContent,
    FormsModule,
    MatButton,
    MatInput,
    MatDialogTitle
  ],
  templateUrl: './note-dialog.html',
  styleUrl: './note-dialog.scss',
  standalone: true
})
export class NoteDialog {
  private api = inject(Api);

  constructor(
    public dialogRef: MatDialogRef<NoteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NoteDtoDto
  ) {}

  cancel() { this.dialogRef.close(); }

  async save() {
    const body = { title: this.data.title, content: this.data.content };
    try {
      if (this.data.id) {
        await this.api.invoke(updateNote, { id: this.data.id, body });
      } else {
        await this.api.invoke(saveNote, { body });
      }
      this.dialogRef.close(true);
    } catch (e) {
      console.error(e);
    }
  }
}
