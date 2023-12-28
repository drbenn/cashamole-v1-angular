import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOneComponent } from '../core/viz/chart-one/chart-one.component';




@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [CommonModule, ChartOneComponent]
})
export class HomeComponent {

}
