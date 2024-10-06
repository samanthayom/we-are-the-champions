import React, { useEffect, useState } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import api from '../api';
import { lightBlue } from '@mui/material/colors';


interface TeamResult {
  id: string;
  name: string;
  points: number;
  alt_points: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
}

interface RankingsData {
  group1: TeamResult[];
  group2: TeamResult[];
}


function GroupRankings() {
    const [rankings, setRankings] = useState<RankingsData>({ group1: [], group2: [] });
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        api.get('/rankings')
            .then(response => setRankings(response.data))
            .catch(error => console.error('Error fetching rankings:', error));
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const renderRankingTable = (teams: TeamResult[]) => (
        <Box >
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell align="right">Points</TableCell>
                            <TableCell align="right">W</TableCell>
                            <TableCell align="right">D</TableCell>
                            <TableCell align="right">L</TableCell>
                            <TableCell align="right">Goals</TableCell>
                            <TableCell align="right">Alt Points</TableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {teams.map((team, index) => (
                        <TableRow 
                            key={team.id}
                            sx={{ 
                                backgroundColor: index < 4 ? lightBlue[50] : 'inherit'
                            }}
                        >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{team.name}</TableCell>
                            <TableCell align="right">{team.points}</TableCell>
                            <TableCell align="right">{team.wins}</TableCell>
                            <TableCell align="right">{team.draws}</TableCell>
                            <TableCell align="right">{team.losses}</TableCell>
                            <TableCell align="right">{team.goals}</TableCell>
                            <TableCell align="right">{team.alt_points}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Current Rankings
            </Typography>
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
        </Box>
    );
}

export default GroupRankings;