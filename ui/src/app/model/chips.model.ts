export interface Chip {
    id?: number;
    kind: string | 'asset' | 'liability' | 'payee' | 'category' | 'income';
    chip: string;
    status: string;
}