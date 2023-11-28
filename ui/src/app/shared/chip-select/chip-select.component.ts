import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsAddEvent, ChipsClickEvent, ChipsModule, ChipsRemoveEvent } from 'primeng/chips';
import { FormsModule } from '@angular/forms';
import { CoreApiService } from '../api/core-api.service';
import { Chip } from '../../model/chips.model';
import { first, take } from 'rxjs';
import { Store } from '@ngxs/store';
import { UserActions } from '../../store/user/userState.actions';

@Component({
  selector: 'app-chip-select',
  standalone: true,
  imports: [CommonModule, ChipsModule, FormsModule],
  templateUrl: './chip-select.component.html',
  styleUrl: './chip-select.component.scss'
})
export class ChipSelectComponent {
  @Input() kind!: string;
  @Input() chipObjects: Chip[] | undefined;
  @Input() chips: string[] | undefined;
  @Output() selectedChip: EventEmitter<{ kind: string, chip: string }> = new EventEmitter();


  protected maxChips: number = 30;


  constructor(
    private coreApi: CoreApiService,
    private store: Store  
  ) {}

  protected onChipClick(event: ChipsClickEvent) {
    const clickedChip: string = event.value;
    console.log('clicked in comp: ', clickedChip);
    
    this.selectedChip.emit({ kind: this.kind, chip: clickedChip }); 
  };

  protected onChipRemove(event: ChipsRemoveEvent) {
    const removeChip: any = event.value.toLowerCase();
    console.log('clicked remove in comp: ', removeChip);
    let fullChip: Chip | undefined;
    
    if (this.chipObjects) {
      fullChip = this.chipObjects.find((item: Chip) => item.chip === removeChip && item.kind === this.kind);
    }
    
    if (fullChip) {
      this.coreApi.deleteChip(fullChip).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            console.log(value);
            // Updates state with new chip / no need for full data pull on db upon each update
            const removeChipIndex: number | undefined = this.chips?.findIndex((chip:string) => chip.toLowerCase() !== value.data.toLowerCase());
            console.log('chipindex: ', removeChipIndex);
            if (removeChipIndex) {
              this.chips = this.chips?.splice(removeChipIndex, 1);
            }
            
            this.store.dispatch(new UserActions.RemoveUserChip(JSON.parse(value.data)));
          },
          error: (error: any) => {
            console.error(error)
          }
        }
      )
    }
  }

  protected onChipAdd(event: ChipsAddEvent) {
    const chipToAdd: string = event.value.toLowerCase();
    console.log('clicked add in comp: ', chipToAdd);
    const fullChip: Chip = {
      kind: this.kind,
      chip: chipToAdd,
      status: 'active',
    }

    this.coreApi.submitNewChip(fullChip).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log(value);
          // Updates state with new chip / no need for full data pull on db upon each update
          this.store.dispatch(new UserActions.AddUserChip(JSON.parse(value.data)));
        },
        error: (error: any) => {
          console.error(error)
        }
      }
    )
  }

}
