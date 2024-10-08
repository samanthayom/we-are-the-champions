import { Team } from "../interfaces";
import { api, apiRequest } from "./index";
import { snakeToCamel, camelToSnake } from "../utils";


export const fetchTeams = async (): Promise<Team[]> => {
    try {
        const responseData = await apiRequest(api.get('/teams'));
        console.log('Teams fetched successfully:', responseData);
        return snakeToCamel(responseData);
    } catch (error) {
        console.error('Failed to fetch teams:', error);
        throw error;
    }
};


export const postTeams = async (teams: Team[]) => {
    try { 
        const responseData = await apiRequest(api.post('/teams', camelToSnake(teams)));
        console.log('Teams posted successfully:', responseData);
    } catch (error) {
        console.error('Failed to post teams:', error);
        throw error;
    }
};


export const deleteTeams = async () => {
    try {
        const responseData = await apiRequest(api.delete('/teams'));
        console.log('Teams deleted successfully:', responseData);
    } catch (error) {
        console.error('Failed to delete teams:', error);
        throw error;
    }
};


export const fetchTeam = async (teamID: string): Promise<Team> => {
    try{
        const responseData = await apiRequest(api.get(`/teams/${teamID}`));
        console.log('Team fetched successfully:', responseData);
        return snakeToCamel(responseData);
    } catch (error) {
        console.error('Failed to fetch team:', error);
        throw error;
    }
};


export const updateTeam = async (teamID: string, team: Team) => {
    try {
        const responseData = await apiRequest(api.put(`/teams/${teamID}`, camelToSnake(team)));
        console.log('Team updated successfully:', responseData);
        return snakeToCamel(responseData);
    } catch (error) {
        console.error('Failed to update team:', error);
        throw error;
    }
};