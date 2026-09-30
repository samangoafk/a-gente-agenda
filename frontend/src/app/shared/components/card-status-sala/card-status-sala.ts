import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-status-sala',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-status-sala.html',
  styleUrl: './card-status-sala.css'
})
export class CardStatusSala {
  @Input({ required: true }) id!: number;
  @Input({ required: true }) nome!: string;
  @Input({ required: true }) tipo!: string;
  @Input({ required: true }) capacidade!: number;
  @Input({ required: true }) status!: 'livre' | 'ocupado' | 'manutencao';
  @Input() proximoHorario?: string;

  @Output() selecionar = new EventEmitter<number>();
  @Output() reservar = new EventEmitter<number>();

  get tipoClasseCss(): string {
    return this.tipo
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .toLowerCase()
      .replace(/\s+/g, '-');          
  }

  aoClicarCard() {
    this.selecionar.emit(this.id);
  }

  aoClicarReservar(event: Event) {
    event.stopPropagation(); 
    this.reservar.emit(this.id);
  } 
}