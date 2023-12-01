export class ChipDto {
    id?: number;
    kind: string | 'asset' | 'liability' | 'category' | 'expense' | 'income' | "vendor";
    chip: string;
    status: string;
}
