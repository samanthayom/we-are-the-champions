import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { Stack } from '@mui/material';
import GroupRankings from './Rankings';
import Teams from './Teams';
import { Team, Rankings } from '../interfaces';
import { fetchTeams } from '../api/teams';
import { fetchRankings } from '../api/rankings';

// Define the context outside of the component
const TeamRankingContext = createContext<TeamRankingContextType | undefined>(undefined);

interface TeamRankingContextType {
    teams: Team[];
    teamsError: string | null;
    rankings: Rankings | null;
    rankingsError: string | null;
    refreshTeams: () => Promise<void>;
    refreshRankings: () => Promise<void>;
}

export const useTeamRankingContext = () => {
    const context = useContext(TeamRankingContext);
    if (context === undefined) {
        throw new Error('useTeamRankingContext must be used within the MainPanel');
    }
    return context;
};

function MainPanel() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamsError, setTeamsError] = useState<string | null>(null);
    const [rankings, setRankings] = useState<Rankings | null>(null);
    const [rankingsError, setRankingsError] = useState<string | null>(null);

    const refreshTeams = useCallback(async () => {
        try {
            setTeamsError(null);
            const fetchedTeams = await fetchTeams();
            setTeams(fetchedTeams);
        } catch (error) {
            console.error('Error fetching teams:', error);
            setTeamsError('Failed to fetch teams');
        }
    }, []);

    const refreshRankings = useCallback(async () => {
        try {
            setRankingsError(null);
            const fetchedRankings = await fetchRankings();
            if (fetchedRankings != null) {
                setRankings(fetchedRankings);
            }
        } catch (error) {
            console.error('Error fetching rankings:', error);
            setRankingsError('Failed to fetch rankings');
        }
    }, []);

    const contextValue = useMemo(
        () => ({
            teams,
            teamsError,
            rankings,
            rankingsError,
            refreshTeams,
            refreshRankings,
        }),
        [teams, teamsError, rankings, rankingsError, refreshTeams, refreshRankings]
    );

    return (
        <TeamRankingContext.Provider value={contextValue}>
            <Stack spacing={6} sx={{ mt: 8, mb: 4 }}>
                <GroupRankings />
                <Teams />
            </Stack>
        </TeamRankingContext.Provider>
    );
}

export default MainPanel;
