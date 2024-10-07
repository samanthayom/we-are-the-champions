import { Match } from "../interfaces";
import api from "./index";


export const postMatches = async (matches: Match[]) => {
    const response = await api.post('/matches', matches);
    if (response.status !== 200) {
        console.error('Failed to post matches:', response.data);
        throw new Error('Failed to post matches');
    }
    console.log('Matches posted successfully:', response.data);
}