import { Home } from "./home";

export interface Apartment {
    id: number;

    size: number;
    rooms: number;
    phone: string;
    haveInternet: boolean;
    home: Home;
}
