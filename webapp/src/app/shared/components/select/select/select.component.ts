import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input,  OnChanges,  Output, SimpleChanges  } from '@angular/core';

@Component({
    selector: 'app-select',
    imports: [CommonModule],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss'
})
export class SelectComponent implements OnChanges {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].firstChange) {
      this.value = changes['value'].currentValue;
    }
  }

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.value = selectElement.value;
    this.valueChange.emit(selectElement.value);
  }
}
