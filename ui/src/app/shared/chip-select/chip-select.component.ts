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
  protected maxChips: number = 50;

  constructor(
    private coreApi: CoreApiService,
    private store: Store  
  ) {}

  
  protected onChipClick(event: ChipsClickEvent) {
    const clickedChip: string = event.value;
    this.selectedChip.emit({ kind: this.kind, chip: clickedChip }); 
  };

  protected onChipRemove(event: ChipsRemoveEvent) {
    const removeChip: any = event.value.toLowerCase();
    let fullChip: Chip | undefined;
    if (this.chipObjects) {
      fullChip = this.chipObjects.find((item: Chip) => item.chip === removeChip && item.kind === this.kind.toLowerCase());
    } ;
    if (fullChip === undefined) {
      fullChip = {
        kind: this.kind.toLowerCase(),
        chip: removeChip.toLowerCase(),
        status: 'delete'
      };
    };
    if (fullChip) {
      this.coreApi.deleteChip(fullChip).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            console.log(value);
            // Updates state with new chip / no need for full data pull on db upon each update
            const removeChipIndex: number | undefined = this.chips?.findIndex((chip:string) => chip.toLowerCase() !== value.data.toLowerCase());
            if (fullChip !== undefined) {
              this.store.dispatch(new UserActions.RemoveUserChip(fullChip));
            };
          },
          error: (error: any) => {
            console.error(error)
          }
    })};};

  protected onChipAdd(event: ChipsAddEvent) {
    const chipToAdd: string = event.value.toLowerCase();


    const fullChip: Chip = {
      kind: this.kind.toLowerCase(),
      chip: chipToAdd.toLowerCase(),
      status: 'active',
    };
    this.coreApi.submitNewChip(fullChip).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          this.store.dispatch(new UserActions.AddUserChip(JSON.parse(value.data)));
        },
        error: (error: any) => {
          console.error(error)
        }
    });};

  protected titleGenerator(type: string): string {
    if (type === 'income') {
      return 'Income Source';
    } else if (type === 'vendor') {
      return 'Vendor';
    } else if (type === 'category') {
      return 'Category'
    }
    else {
      return '[ERROR]';
    }
    
  }

}
