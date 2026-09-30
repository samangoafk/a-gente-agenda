import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'

@Component({
  imports: [ RouterLink],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {}
