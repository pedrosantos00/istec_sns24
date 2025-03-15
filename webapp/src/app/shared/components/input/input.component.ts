import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
    selector: 'app-input',
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        }
    ]
})
export class InputComponent implements ControlValueAccessor {
  @Output() changes: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() fileUploaded: EventEmitter<File | null> = new EventEmitter<File | null>();

  onChanged: any = () => {};
  onTouched: any = () => {};

  _value: string = '';
  selectedFile: File | null = null;

  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() label: string = 'Default Label';
  @Input() disable: boolean = false;
  @Input() readonly: boolean = false;
  @Input() accept: string = '';
  @Input() min: string = '';

  constructor() {}

  inputChanged(event: Event) {
    const input = event.target as HTMLInputElement;

    if (this.type === 'file' && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.onChanged(this.selectedFile);
      this.onTouched(this.selectedFile);
      this.fileUploaded.emit(this.selectedFile);
    } else {
      this._value = input.value;
      this.onChanged(this._value);
      this.onTouched(this._value);
      this.changes.emit(event);
    }
  }

  writeValue(obj: any): void {
    if (this.type === 'file') {
      this.selectedFile = obj;
    } else {
      this._value = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }
}
