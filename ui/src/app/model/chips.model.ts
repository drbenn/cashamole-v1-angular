export interface Chip {
    id?: number;
    kind: string | 'asset' | 'liability' | 'category' | 'expense' | 'income';
    chip: string;
    status: string;
}