export class ChipDto {
    id?: number;
    kind: string | 'asset' | 'liability' | 'category' | 'expense' | 'income';
    chip: string;
    status: string;
}
