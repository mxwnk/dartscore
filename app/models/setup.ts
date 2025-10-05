import { Checkout } from "./checkout";

export type Setup = {
    startpoints: number;
    checkout: Checkout;
    legs: number;
}