export class ChipDto {
    id?: number;
    kind: string | 'asset' | 'liability' | 'payee' | 'category' | 'income';
    chip: string;
    status: string;
}
