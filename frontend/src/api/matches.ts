import { Match } from "../interfaces";
import { snakeToCamel } from "../utils";
import api from "./index";


export const postMatches = async (matches: Match[]) => {
    const response = await api.post('/matches', matches);
    if (response.status !== 200) {
        console.error('Failed to post matches:', response.data);
        throw new Error('Failed to post matches');
    }
    console.log('Matches posted successfully:', response.data);
}


export const fetchMatches = async (teamID: string): Promise<Match[]> => {
    const response = await api.get(`/matches/${teamID}`);
    if (response.status !== 200) {
        console.error('Failed to fetch matches:', response.data);
        throw new Error('Failed to fetch matches');
    }
    console.log('Matches fetched successfully:', response.data);
    return snakeToCamel(response.data);
}


export const deleteMatches = async () => {
    const response = await api.delete('/matches');
    if (response.status !== 200) {
        console.error('Failed to delete matches:', response.data);
        throw new Error('Failed to delete matches');
    }
    console.log('Matches deleted successfully:', response.data);
}


export const updateMatch = async (match: Match) => {
    const response = await api.put(`/matches/${match.id}`, match);
    if (response.status !== 200) {
        console.error('Failed to post match:', response.data);
        throw new Error('Failed to post match');
    }
    console.log('Match posted successfully:', response.data);
}
