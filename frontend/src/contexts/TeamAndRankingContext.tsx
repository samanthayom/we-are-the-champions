import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { Team, Rankings } from '../interfaces';
import { fetchTeams } from '../api/teams';
import { fetchRankings } from '../api/rankings';

interface TeamAndRankingContextType {
    teams: Team[];
    teamsError: string | null;
    rankings: Rankings | null;
    rankingsError: string | null;
    refreshTeams: () => Promise<void>;
    refreshRankings: () => Promise<void>;
}

const TeamAndRankingContext = createContext<TeamAndRankingContextType | undefined>(undefined);

export const useTeamAndRankingContext = () => {
    const context = useContext(TeamAndRankingContext);
    if (context === undefined) {
        throw new Error('useTeamAndRankingContext must be used within a TeamAndRankingProvider');
    }
    return context;
};

export const TeamAndRankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
            setRankings(fetchedRankings);
        } catch (error) {
            console.error('Error fetching rankings:', error);
            setRankingsError('Failed to fetch rankings');
        }
    }, []);

    useEffect(() => {
        refreshTeams();
        refreshRankings();
    }, [refreshTeams, refreshRankings]);

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
        <TeamAndRankingContext.Provider value={contextValue}>
            {children}
        </TeamAndRankingContext.Provider>
    );
};