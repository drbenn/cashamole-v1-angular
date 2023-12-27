export class ChipDto {
    id?: number;
    kind: string | 'asset' | 'liability' | 'expense_category' | 'expense_vendor' | 'income_source' | 'invest_institution';
    chip: string;
    status: string;
}
