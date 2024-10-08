import { Team } from "../interfaces";
import { api, apiRequest } from "./index";
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


export const deleteTeams = async () => {
    const response = await api.delete('/teams');
    if (response.status !== 200) {
        console.error('Failed to delete teams:', response.data);
        throw new Error('Failed to delete teams');
    }
    console.log('Teams deleted successfully:', response.data);
};


export const fetchTeam = async (teamID: string): Promise<Team> => {
    const response = await api.get(`/teams/${teamID}`);
    if (response.status !== 200) {
        console.error('Failed to fetch team:', response.data);
        throw new Error('Failed to fetch team');
    }
    return snakeToCamel(response.data);
};


export const updateTeam = async (teamID: string, team: Team) => {
    console.log('Updating team:', camelToSnake(team));
    const response = await api.put(`/teams/${teamID}`, camelToSnake(team));
    if (response.status !== 200) {
        console.error('Failed to update team:', response.data);
        throw new Error('Failed to update team');
    }
    return snakeToCamel(response.data);
};
