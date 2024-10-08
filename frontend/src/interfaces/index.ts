export interface Team {
    id?: string;
    name: string;
    registrationDate: string;
    group: number;
    matches?: string[];

    points?: number;
    altPoints?: number;
    wins?: number;
    draws?: number;
    losses?: number;
    goals?: number;
}


export interface Match{
    id?: string;
    teams: {
        name: string;
        score: number;
    }[];
}


export interface Rankings {
    group1: Team[];
    group2: Team[];
}


export class CustomError extends Error {
    detail: string;
    uiMessage: string;

    constructor(detail: string) {
        super(detail);
        this.name = this.constructor.name;
        this.detail = detail;
        this.uiMessage = detail;
    }       
}


