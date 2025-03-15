import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-diabetesCalculator',
  templateUrl: './diabetesCalculator.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputComponent,ButtonComponent],
  styleUrls: ['./diabetesCalculator.component.css'],
})
export default class DiabetesCalculatorComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  fastingGlucose!: number;
  postPrandialGlucose!: number;
  result!: string;
  resultColor!: string;

  checkDiabetes(): void {
    if (this.fastingGlucose < 100 && this.postPrandialGlucose < 140) {
      this.result = 'Nível de glicemia normal.';
      this.resultColor = 'text-green-600';
    } else if (
      (this.fastingGlucose >= 100 && this.fastingGlucose <= 125) ||
      (this.postPrandialGlucose >= 140 && this.postPrandialGlucose <= 199)
    ) {
      this.result = 'Pré-diabetes detectada. Consulte um médico.';
      this.resultColor = 'text-yellow-600';
    } else if (this.fastingGlucose > 125 || this.postPrandialGlucose > 199) {
      this.result = 'Diabetes detectada. Procure ajuda médica imediatamente.';
      this.resultColor = 'text-red-600';
    } else {
      this.result = 'Erro ao calcular. Verifique os valores inseridos.';
      this.resultColor = 'text-gray-600';
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
