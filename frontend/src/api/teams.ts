import { Team } from "../interfaces";
import api from "./index";
import { snakeToCamel, camelToSnake } from "../utils";

export const fetchTeams = async (): Promise<Team[]> => {
    const response = await api.get('/teams');
    if (response.status !== 200) {
        console.error('Failed to fetch teams:', response.data);
        throw new Error('Failed to fetch teams');
    }
    console.log('Teams fetched successfully:', response.data);
    return snakeToCamel(response.data);
};


export const postTeams = async (teams: Team[]) => {
    const response = await api.post('/teams', 
        camelToSnake(teams)
        );
    if (response.status !== 200) {
        console.error('Failed to post teams:', response.data);
        throw new Error('Failed to post teams');
    }
    console.log('Teams posted successfully:', response.data);
};


