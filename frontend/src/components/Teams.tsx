import React, { useState } from 'react';
import { 
    Alert,
    Box,
    Button,
    Dialog,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { grey } from '@mui/material/colors';

import Form from './Form';
import { useTeamAndRankingContext } from '../contexts/TeamAndRankingContext';
import { formatDate } from '../utils';


function Teams({ onTeamSelect }: { onTeamSelect: (teamId: string) => void }) {
    const { teams, teamsError, refreshTeams, refreshRankings } = useTeamAndRankingContext();
    const [open, setOpen] = useState(false);

    const handleRowClick = (teamId: string) => onTeamSelect(teamId);
    const handleOpenForm = () => setOpen(true);
    const handleCloseForm = () => { 
        refreshTeams();
        refreshRankings();
        setOpen(false)
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                All Teams
            </Typography>
            {teamsError ? (
                <Alert severity="error">
                    {teamsError}
                </Alert>
            ) : teams.length === 0 ? (
                <Paper 
                    sx={{
                        mt: 2,
                        p: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: grey[100],
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                    }}
                >
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                       No teams or match results available.
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenForm} >Add</Button>
                </Paper>
            ) : (
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
                            <TableRow 
                                key={index}
                                onClick={() => team.id && handleRowClick(team.id)}
                                hover
                                sx={{
                                    cursor: 'pointer'
                                }}
                            >
                                <TableCell>{team.name}</TableCell>
                                <TableCell align="center">{team.group}</TableCell>
                                <TableCell align="center">{formatDate(team.registrationDate)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Dialog open={open} onClose={handleCloseForm} fullWidth>
                <Form onClose={handleCloseForm} />
            </Dialog>
        </Box>
    );
}

export default Teams;