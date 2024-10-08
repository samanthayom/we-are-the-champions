import React, { useState } from 'react';
import { Button, Stack, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Rankings from './Rankings';
import Teams from './Teams';
import { deleteTeams } from '../api/teams';
import { deleteMatches } from '../api/matches';
import TeamPanel from './TeamPanel';
import { useTeamAndRankingContext } from '../contexts/TeamAndRankingContext';
import { CustomError } from '../interfaces';


function MainPanel() {
    const {teams, refreshTeams, refreshRankings} = useTeamAndRankingContext();
    const [teamDetailsOpen, setTeamDetailsOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const handleTeamDetailsOpen = (teamId: string) => {
        setSelectedTeamId(teamId);
        setTeamDetailsOpen(true);
    };

    const handleTeamDetailsClose = () => {
        refreshTeams();
        refreshRankings();
        setSelectedTeamId(null);
        setTeamDetailsOpen(false);
    };


    const handleClearAllData = async () => {
        try {
            await Promise.all([deleteTeams(), deleteMatches()]);
            refreshTeams();
            refreshRankings();
        } catch (error) {
            console.error("Error clearing data:", error);
            setError(error instanceof CustomError ? error.uiMessage : 'An unexpected error occurred');
        }
    };

    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}  
            <Stack spacing={6} sx={{ mt: 8, mb: 4 }}>
                <Rankings onTeamSelect={handleTeamDetailsOpen}/>
                <Teams onTeamSelect={handleTeamDetailsOpen}/>
                {teams.length > 0 && (
                    <Button
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        onClick={handleClearAllData}
                        sx={{ alignSelf: 'flex-end' }}
                    >
                        Clear All Data
                    </Button>
                )}
            </Stack>
            {selectedTeamId && teamDetailsOpen && (
                <TeamPanel onClose={handleTeamDetailsClose} teamID={selectedTeamId} />
            )}
         </>
    );
}

export default MainPanel;
