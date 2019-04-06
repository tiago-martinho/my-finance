import { MovementType } from './movement-type.enum';
import { Category } from './categories/category.model';

export class Movement {
    constructor(public id: string,
        public accountId: string,
        public type: MovementType,
        public category: Category,
        public description: string,
        public value: number,
        public date: Date) {}
}