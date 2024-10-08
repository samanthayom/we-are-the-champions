import React, { useState } from 'react';
import { Match, Team } from '../interfaces';
import { Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button} from '@mui/material';
import { Clear, Edit, Save } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useTeamAndRankingContext } from '../contexts/TeamAndRankingContext';
import { TeamMatchRow, EditableTeamMatchRow } from './TeamMatchRow';
import { fetchMatches, updateMatch } from '../api/matches';


interface TeamMatchesProps {
    team: Team;
    matches: Match[];
}


function TeamMatches({team, matches}: TeamMatchesProps) {
    const {teams} = useTeamAndRankingContext();
    const [matchesState, setMatchesState] = useState<Match[]>(matches);
    const [isEditing, setIsEditing] = useState(false);
    
    const allTeamNames = teams.map(t => t.name);

    const handleMatchChange = (updatedMatch: Match) => {
        console.log('updatedMatch', updatedMatch);
        setMatchesState(prevMatches => 
            prevMatches.map(match => 
                match.id === updatedMatch.id ? updatedMatch : match
            )
        );
    };


    const handleSave = async () => {
        console.log('matchesState', matchesState);
        await Promise.all(
            matchesState.map(async (match) => {
                try {
                    await updateMatch(match);
                } catch (error) {
                    console.error(`Error posting match ${match.id}:`, error);
                }
            })
        )
        setIsEditing(false);
    };

    const handleCancel = () => {
        fetchMatches(team.id!)
            .then((fetchedMatches) => {
                setMatchesState(fetchedMatches);
                setIsEditing(false);
            })
            .catch(error => console.error('Error fetching matches:', error));
    };


    return (
        <Box mt={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Matches</Typography>
                {isEditing ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            startIcon={<Save/>} 
                            variant="contained" 
                            size="small"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                        <Button 
                            startIcon={<Clear/>} 
                            variant="outlined" 
                            size="small"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </Box>
                ) : (
                    <Button 
                        startIcon={<Edit/>} 
                        variant="text" 
                        size="small"
                        onClick={() => setIsEditing(true)}
                        sx={{color: grey[500]}}
                    >
                        Edit
                    </Button>
                )}
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Opponent</TableCell>
                            <TableCell align="right">Opponent Score</TableCell>
                            <TableCell align="left" sx={{fontWeight: 'bold'}}>{team.name} Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matchesState.map((match) => (
                            isEditing ? (
                                <EditableTeamMatchRow key={match.id} teamName={team.name} allTeamNames={allTeamNames} match={match} onMatchChange={handleMatchChange} />
                            ) : (
                                <TeamMatchRow key={match.id} teamName={team.name} match={match} />
                            )
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    );
}
        


export default TeamMatches;