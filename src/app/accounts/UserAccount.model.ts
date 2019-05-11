import { Movement } from '../movements/movement.model';

export class BankAccount {

     constructor(public id: string,
        public userId: string,
        public name: string,
        public value: number,
        public movements: Movement[]) {}
}