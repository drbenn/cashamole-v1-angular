import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsAddEvent, ChipsClickEvent, ChipsModule, ChipsRemoveEvent } from 'primeng/chips';
import { FormsModule } from '@angular/forms';
import { CoreApiService } from '../../api-services/core-api.service';
import { Chip } from '../../models/chips.model';
import { Store } from '@ngxs/store';
import { ChipActions } from '../../store/chip/chipState.actions';
import { first, take } from 'rxjs';

@Component({
  selector: 'app-chip-select',
  standalone: true,
  imports: [CommonModule, ChipsModule, FormsModule],
  templateUrl: './chip-select.component.html',
  styleUrl: './chip-select.component.scss'
})
export class ChipSelectComponent implements OnInit {
  @Input() kind!: string;
  @Input() chipObjects: Chip[] | undefined;
  @Input() chipStrings: string[] = [];
  @Output() selectedChip: EventEmitter<{ kind: string, chip: string }> = new EventEmitter();
  protected maxChips: number = 100;

  constructor(
    private coreApi: CoreApiService,
    private store: Store  
  ) {}

  ngOnInit(): void {
    if (this.chipObjects?.length) {
      this.setChips(this.chipObjects);
    };
  };

  private setChips(chips: Chip[]): void {
    this.chipObjects = chips;
    this.chipStrings = [];
    chips.forEach((chip: Chip) => {
        this.chipStrings.push(chip.chip.charAt(0).toUpperCase() + chip.chip.slice(1));
    });
  };
  
  protected onChipClick(event: ChipsClickEvent): void {
    const clickedChip: string = event.value;
    this.selectedChip.emit({ kind: this.kind, chip: clickedChip }); 
  };

  protected onChipRemove(event: ChipsRemoveEvent): void {
    const removeChip: any = event.value.toLowerCase();
    let fullChip: Chip | undefined;

    if (this.chipObjects) {
      fullChip = this.chipObjects.find((item: Chip) => item.chip === removeChip && item.kind === this.kind.toLowerCase());
    };
    // when chip was added, submitted to db, included in store, but no db call has been made for update
    if (fullChip === undefined) {
      fullChip = this.creatFullChipObjectForSubmit(removeChip, 'delete');
    };
    if (fullChip) {
      this.coreApi.deleteChip(fullChip).pipe(take(1), first())
      .subscribe(
        {
          next: (value: any) => {
            // Updates state with new chip / no need for full data pull on db upon each update
            if (fullChip !== undefined) {
              this.store.dispatch(new ChipActions.RemoveUserChip(fullChip));
            };
          },
          error: (error: any) => {
            console.error(error)
          }
  })};};

  protected onChipAdd(event: ChipsAddEvent): void {
    const chipToAdd: string = event.value.toLowerCase();
    const fullChip: Chip = this.creatFullChipObjectForSubmit(chipToAdd, 'active');
    this.coreApi.submitNewChip(fullChip).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          this.store.dispatch(new ChipActions.AddUserChip(JSON.parse(value.data)));
        },
        error: (error: any) => {
          console.error(error)
        }
  });};

  private creatFullChipObjectForSubmit(chipString: string, status: 'active' | 'delete'): Chip {
    return {
      kind: this.kind.toLowerCase(),
      chip: chipString.toLowerCase(),
      status: status,
    };
  };

  protected titleGenerator(kind: string): string {
    switch (kind) {
      case 'category': 
        return 'Expense Category';
      case 'vendor': 
        return 'Vendor';
      case 'income_source': 
        return 'Income Source';
      case 'invest_institution': 
        return 'Investment Institution';
      case 'asset':
        return 'Asset Account';
      case 'liability': 
        return 'Liability Account';
      default:
        return 'error';
    };
  };

}
