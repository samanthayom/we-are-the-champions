import { api, apiRequest } from "./index";
import { Rankings } from "../interfaces";
import { snakeToCamel } from "../utils";


export const fetchRankings = async (): Promise<Rankings | null> => {
    try {
        const responseData = await apiRequest(api.get('/rankings'));
        console.log('Rankings fetched successfully:', responseData);
        if (responseData === null) {
            return null;
        } else {
            return {
                group1: snakeToCamel(responseData.group1),
                group2: snakeToCamel(responseData.group2)
            };
        }
    } catch (error) {
        console.error('Failed to fetch rankings:', error);
        throw error;
    }
};