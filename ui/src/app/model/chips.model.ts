export interface Chip {
    id: number;
    kind: string | 'asset' | 'liability' | 'payee' | 'category';
    chip: string;
    status: string;
}