import React, { useState } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, Alert } from '@mui/material';
import { grey, lightBlue } from '@mui/material/colors';

import { useTeamAndRankingContext } from '../contexts/TeamAndRankingContext';
import { Team } from '../interfaces';


function Rankings({ onTeamSelect }: { onTeamSelect: (teamId: string) => void })  {
    const {rankings, rankingsError} = useTeamAndRankingContext();
    const [activeTab, setActiveTab] = useState(0);

    const handleRowClick = (teamId: string) => onTeamSelect(teamId);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const renderRankingTable = (teams: Team[]) => (
        <Box >
            <TableContainer component={Paper}>
                {teams.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        No match results available for this group.
                    </Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Rank</TableCell>
                                <TableCell>Team</TableCell>
                                <TableCell align="right">Points</TableCell>
                                <TableCell align="center">W</TableCell>
                                <TableCell align="center">D</TableCell>
                                <TableCell align="center">L</TableCell>
                                <TableCell align="center">Goals</TableCell>
                                <TableCell align="left">Alt Points</TableCell>
                                
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {teams.map((team, index) => (
                            <TableRow 
                                key={team.id}
                                onClick={() => team.id && handleRowClick(team.id)}
                                hover
                                sx={{ 
                                    cursor: 'pointer',
                                    backgroundColor: index < 4 ? lightBlue[50] : 'inherit'
                                }}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{team.name}</TableCell>
                                <TableCell align="right">{team.points}</TableCell>
                                <TableCell align="center">{team.wins}</TableCell>
                                <TableCell align="center">{team.draws}</TableCell>
                                <TableCell align="center">{team.losses}</TableCell>
                                <TableCell align="center">{team.goals}</TableCell>
                                <TableCell align="left">{team.altPoints}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
        </Box>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Current Rankings
            </Typography>
            { rankings === null ? (
                <Paper 
                    sx={{
                        mt: 2,
                        p: 6,
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: grey[100],
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                    }}
                >
                    {rankingsError ? (
                        <Alert severity="error">
                            {/* TODO: Handle error below */}
                            {rankingsError}  
                        </Alert>
                    ) : (
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            No rankings to display.
                        </Typography>
                    )}
                </Paper>    
               
            ) : (
                <>  
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            <Tab label="Group 1" />
                            <Tab label="Group 2" />
                        </Tabs>
                    </Box>

                    <Box>
                        {activeTab === 0 && renderRankingTable(rankings.group1)}
                        {activeTab === 1 && renderRankingTable(rankings.group2)}
                    </Box>
                </>
            )}
        </Box>
    );
}

export default Rankings;