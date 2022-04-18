import { Apartment } from "./apartment";

export interface Person {
    id: number;
    name: string;
    lastName: string;
    genre: string;
    apartment: Apartment
}
