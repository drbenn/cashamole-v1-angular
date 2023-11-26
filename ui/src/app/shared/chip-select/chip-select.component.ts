import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsAddEvent, ChipsClickEvent, ChipsModule, ChipsRemoveEvent } from 'primeng/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chip-select',
  standalone: true,
  imports: [CommonModule, ChipsModule, FormsModule],
  templateUrl: './chip-select.component.html',
  styleUrl: './chip-select.component.scss'
})
export class ChipSelectComponent {
  @Input() kind!: string;
  @Input() chips: string[] | undefined;
  @Output() selectedChip: EventEmitter<{ kind: string, chip: string }> = new EventEmitter();


  protected maxChips: number = 30;



  protected onChipClick(event: ChipsClickEvent) {
    const clickedChip: string = event.value;
    console.log('clicked in comp: ', clickedChip);
    
    this.selectedChip.emit({ kind: this.kind, chip: clickedChip }); 
  };

  protected onChipRemove(event: ChipsRemoveEvent) {
    const removeChip: any = event.value;
    console.log('clicked remove in comp: ', removeChip);
  }

  protected onChipAdd(event: ChipsAddEvent) {
    const addChip: string = event.value;
    console.log('clicked add in comp: ', addChip);
  }

}
