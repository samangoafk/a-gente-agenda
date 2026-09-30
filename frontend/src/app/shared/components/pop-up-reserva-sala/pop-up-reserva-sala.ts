import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pop-up-reserva-sala',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pop-up-reserva-sala.html',
  styleUrl: './pop-up-reserva-sala.css'
})
export class PopUpReservaSala {
  @Input() exibe: boolean = false;
  @Input() nomeSala: string = '';
  @Input() status: 'livre' | 'manutencao' | 'ocupado' = 'livre';
  @Input() creditos: number = 8;

  @Output() fechar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();
  @Output() escolherOutraData = new EventEmitter<void>();

  onFechar(): void {
    this.fechar.emit();
  }

  onConfirmar(): void {
    this.confirmar.emit();
  }

  onEscolherOutraData(): void {
    this.escolherOutraData.emit();
  }
}