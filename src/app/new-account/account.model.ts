import { Movement } from '../movements/movement.model';

export class Account {
    constructor(public id: string,
        public userId: string,
        public name: string,
        public movements: Movement[],
        public balance: number) {}
}