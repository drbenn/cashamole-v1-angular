import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsAddEvent, ChipsClickEvent, ChipsModule, ChipsRemoveEvent } from 'primeng/chips';
import { FormsModule } from '@angular/forms';
import { CoreApiService } from '../api/core-api.service';
import { Chip } from '../../model/chips.model';
import { Observable, first, take } from 'rxjs';
import { Store } from '@ngxs/store';
import { UserActions } from '../../store/user/userState.actions';

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
      console.log('chipinit kind: ', this.kind);
      console.log(this.chipObjects);
      console.log(this.chipStrings);
      
      
      
      if (this.chipObjects?.length) {
        this.setChips(this.chipObjects);
      };
    };

  private setChips(chips: Chip[]) {
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
    console.log('on remove chip');
    
    
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
            console.log(value);
            // Updates state with new chip / no need for full data pull on db upon each update
            // const removeChipIndex: number | undefined = this.chips?.findIndex((chip:string) => chip.toLowerCase() !== value.data.toLowerCase());
            if (fullChip !== undefined) {
              this.store.dispatch(new UserActions.RemoveUserChip(fullChip));
            };
          },
          error: (error: any) => {
            console.error(error)
          }
    })};};

  protected onChipAdd(event: ChipsAddEvent): void {
    const chipToAdd: string = event.value.toLowerCase();
    const fullChip: Chip = this.creatFullChipObjectForSubmit(chipToAdd, 'active');
    console.log('ON CHIP ADD');
    
    this.coreApi.submitNewChip(fullChip).pipe(take(1), first())
    .subscribe(
      {
        next: (value: any) => {
          console.log('to dispatch');
          
          this.store.dispatch(new UserActions.AddUserChip(JSON.parse(value.data)));
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

  protected titleGenerator(type: string): string {
    if (type === 'expense_category') {
      return 'Category';
    } else if (type === 'expense_vendor') {
      return 'Vendor';
    } else if (type === 'asset') {
      return 'Asset';
    } else if (type === 'liability') {
      return 'Liaiblity';
    } else if (type === 'income_source') {
      return 'Income Source'
    } else {
      return '[ERROR]';
    };
  };

}
