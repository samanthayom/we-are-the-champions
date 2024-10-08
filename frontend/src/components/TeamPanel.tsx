import React, { useEffect, useState } from 'react';
import { Drawer, IconButton, Box, Typography, Stack, Alert } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { Team, Match, CustomError } from '../interfaces';
import TeamDetails from './TeamDetails';
import TeamMatches from './TeamMatches';
import { fetchTeam } from '../api/teams';
import { fetchMatches } from '../api/matches';



interface TeamPanelProps {
  onClose: () => void;
  teamID: string;
}


const drawerWidth = 600;


function TeamPanel({ onClose, teamID }: TeamPanelProps) {
    const [team, setTeam] = useState<Team>();
    const [matches, setMatches] = useState<Match[]>();
    const [error, setError] = useState<string | null>(null);

    
    useEffect(() => {
        Promise.all([fetchTeam(teamID), fetchMatches(teamID)])
            .then(([teamData, matchesData]) => {
                setTeam(teamData);
                setMatches(matchesData);
            })
            .catch((error) => {
                console.error(error);
                setError(error instanceof CustomError ? error.uiMessage : 'An unexpected error occurred');
            });
    }, [teamID]);
    
    return (
        <Drawer         
            open={true} 
            onClose={onClose} 
            anchor="right"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
        >
            <Box p={4}>
                {team && (
                    <>
                        <IconButton onClick={onClose} sx={{alignSelf: 'flex-start'}}>
                            <ChevronRightIcon/>
                        </IconButton>
                        <Stack p={2}>
                            <Typography variant="h4" gutterBottom>{team.name}</Typography>
                            {error ? (
                                <Alert severity="error">{error}</Alert>
                                
                            ) : (
                                <>
                                    <TeamDetails team={team}/>
                                    {matches && (
                                        <TeamMatches team={team} matches={matches}/>
                                    )}  
                                </>
                            )}
                                         
                        </Stack>
                    </>
                )}
            </Box>
        </Drawer>
    );
}

export default TeamPanel;