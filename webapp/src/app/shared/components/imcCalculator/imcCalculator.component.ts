import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-imcCalculator',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './imcCalculator.component.html',
  styleUrls: ['./imcCalculator.component.css'],
})
export class ImcCalculatorComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  weight!: number;
  heightCm!: number;
  result!: number;
  classification!: string;

  calculateIMC(): void {
    const heightMeters = this.heightCm / 100;
    this.result = parseFloat((this.weight / (heightMeters * heightMeters)).toFixed(2));
    this.classification = this.getIMCClassification(this.result);
  }

  getIMCClassification(imc: number): string {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc >= 18.5 && imc < 24.9) return 'Peso normal';
    if (imc >= 25 && imc < 29.9) return 'Sobrepeso';
    if (imc >= 30 && imc < 34.9) return 'Obesidade Grau 1';
    if (imc >= 35 && imc < 39.9) return 'Obesidade Grau 2';
    return 'Obesidade Grau 3 (Mórbida)';
  }

  closeModal(): void {
    this.close.emit();
  }
}
