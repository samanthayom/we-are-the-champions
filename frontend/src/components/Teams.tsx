import React, { useEffect, useState } from 'react';
import { Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody } from '@mui/material';
import api from '../api';   


interface Team {
    name: string;
    registration_date: string;
    group: number;
}

function Teams() {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        api.get('/teams')
            .then(response => setTeams(response.data))
            .catch(error => console.error('Error fetching teams:', error));
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                All Teams
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Group</TableCell>
                            <TableCell align="center">Registration Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.map((team, index) => (
                            <TableRow key={index}>
                                <TableCell>{team.name}</TableCell>
                                <TableCell align="center">{team.group}</TableCell>
                                <TableCell align="center">{formatDate(team.registration_date)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Teams;