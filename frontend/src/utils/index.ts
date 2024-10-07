
import { Team, Match } from '../interfaces';


function convertDateToISO(dateStr: string): string {
    const [day, month] = dateStr.split('/');
    const currentYear = new Date().getUTCFullYear();
    const date = new Date(Date.UTC(currentYear, parseInt(month, 10) - 1, parseInt(day, 10)));
    return date.toISOString();
}


export const parseTeamsInput = (input: string): Team[] => {
    const dateRegex = /^\d{2}\/\d{2}$/;
    const lines = input.trim().split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0 || lines.length !== 12) {
        throw new Error(`You must provide exactly 12 teams.`);
    }

    return lines.map((line, index) => {
        const fields = line.trim().split(' ');

        if (fields.length !== 3) {
            throw new Error(`Line ${index + 1}: Invalid format. Each line should be a space-separated list of each team's name, registration date, and group number.`);
        }

        const [name, dateStr, groupStr] = fields;

        if (!dateRegex.test(dateStr)) {
            throw new Error(`Line ${index + 1}: Invalid format. Date must be in the format DD/MM.`);
        }

        let registrationDate: string;
        try {
            registrationDate = convertDateToISO(dateStr);
        } catch (error) {
            throw new Error(`Line ${index + 1}: Invalid date. Date must be in the format DD/MM.`);
        }


        const group = parseInt(groupStr, 10);
        if (isNaN(group) || (group !== 1 && group !== 2)) {
            throw new Error(`Line ${index + 1}: Invalid group number. Group must be either 1 or 2.`);
        }

        return { 
            name: name  ,
            registrationDate: registrationDate,
            group: group, 
        };
    });
};


export const parseMatchesInput = (input: string): Match[] => {
    const lines = input.trim().split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) {
        throw new Error(`You must provide at least 1 match result.`);
    }

    return lines.map((line, index) => {
        const fields = line.trim().split(' ');

        if (fields.length !== 4) {
            throw new Error(`Line ${index + 1}: Invalid format. Each line should be a space-separated list of: Team 1's name, Team 2's name, Team 1's score, and Team 2's score.`);
        }

        const [team1, team2, score1Str, score2Str] = fields;

        if (typeof team1 !== 'string' || typeof team2 !== 'string') {
            throw new Error(`Line ${index + 1}: Invalid format. The first two fields must be team names (string).`);
        }

        const score1 = parseInt(score1Str, 10);
        const score2 = parseInt(score2Str, 10);

        if (isNaN(score1) || isNaN(score2)) {
            throw new Error(`Line ${index + 1}: Invalid score. The last two items must be team scores (integer).`);
        }

        return {
            teams: [
                { name: team1, score: score1 },
                { name: team2, score: score2 }
            ]
        };
    });
};


export const snakeToCamel = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map((v) => snakeToCamel(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            acc[camelKey] = snakeToCamel(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

export const camelToSnake = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map((v) => camelToSnake(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
            acc[snakeKey] = camelToSnake(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}
