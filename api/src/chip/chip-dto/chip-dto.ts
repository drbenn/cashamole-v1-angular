export class ChipDto {
    id?: number;
    kind: string | 'asset' | 'liability' | 'transaction';
    chip: string;
    status: string;
}
