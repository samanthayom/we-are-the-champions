export interface Team {
    id?: string;
    name: string;
    registrationDate: string;
    group: number;
    matches?: string[];

    points?: number;
    alt_points?: number;
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