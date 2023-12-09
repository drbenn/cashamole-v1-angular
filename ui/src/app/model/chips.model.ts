export interface Chip {
    id?: number;
    kind: string | 'asset' | 'liability' | 'category' | 'expense' | 'income';
    chip: string;
    status: string;
}

export interface ChipStateStructure {
    asset: Chip[],
    liability: Chip[],
    expense_category: Chip[],
    expense_vendor: Chip[],
    income_source: Chip[] 
  }
