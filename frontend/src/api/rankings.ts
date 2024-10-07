import api from "./index";
import { Rankings } from "../interfaces";
import { snakeToCamel } from "../utils";


export const fetchRankings = async (): Promise<Rankings | null> => {
    const response = await api.get('/rankings');
    if (response.status !== 200) {
        console.error('Failed to fetch rankings:', response.data);
        throw new Error('Failed to fetch rankings');
    }
    console.log('Rankings fetched successfully:', response.data);

    if (response.data == null) {
        return null;
    } else {
        return {
            group1: snakeToCamel(response.data.group1),
            group2: snakeToCamel(response.data.group2)
        };
    }
};