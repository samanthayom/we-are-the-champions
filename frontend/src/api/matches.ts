import { Match } from "../interfaces";
import { snakeToCamel } from "../utils";
import { api, apiRequest } from "./index";


export const postMatches = async (matches: Match[]) => {
    try {
        const responseData = await apiRequest(api.post('/matches', matches));
        console.log('Matches posted successfully:', responseData);
    } catch (error) {
        console.error('Failed to post matches:', error);
        throw error;
    }
}


export const fetchMatches = async (teamID: string): Promise<Match[]> => {
    try{
        const responseData = await apiRequest(api.get(`/matches/${teamID}`));
        console.log('Matches fetched successfully:', responseData);
        return snakeToCamel(responseData);
    } catch (error) {
        console.error('Failed to fetch matches:', error);
        throw error;
    }
}


export const deleteMatches = async () => {
    try {
        const responseData = await apiRequest(api.delete('/matches'));
        console.log('Matches deleted successfully:', responseData);
    } catch (error) {
        console.error('Failed to delete matches:', error);
        throw error;
    }
}


export const updateMatch = async (match: Match) => {
    try {
        const responseData = await apiRequest(api.put(`/matches/${match.id}`, match));
        console.log('Matches updated successfully:', responseData);
    } catch (error) {
        console.error('Failed to update matches:', error);
        throw error;
    }
}
