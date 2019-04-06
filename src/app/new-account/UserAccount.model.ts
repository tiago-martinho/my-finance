import { Movement } from '../movements/movement.model';

export class UserAccount {

     constructor(public id: string,
        public userId: string,
        public name: string,
        public value: number,
        public movements: Movement[]) {}
}