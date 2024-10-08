import React, { useState } from 'react';
import { Team } from '../interfaces';
import { Typography, Box, Button, Stack, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Clear, Edit, Save } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { formatDate } from '../utils';
import { fetchTeam, updateTeam } from '../api/teams';



interface TeamDetailsProps {
    team: Team;
}


function TeamDetails({ team }: TeamDetailsProps) {
    const [teamState, setTeamState] = useState<Team>(team);
    const [isEditing, setIsEditing] = useState(false);
    const [inputError, setInputError] = useState<boolean>(false);


    const handleGroupChange = (event: SelectChangeEvent) => {
        setTeamState({ ...teamState, group: parseInt(event.target.value) });
    };

    const handleRegistrationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputDate = e.target.value.trim();
        if (!inputDate) {
            setInputError(true);
            setTeamState({ ...teamState, registrationDate: '' });
            return;
        }
        try {
            setTeamState({ ...teamState, registrationDate: `${inputDate}T00:00:00` });
            setInputError(false);
        } catch (error) {
            setInputError(true);
        }

    };

    const handleSave = () => {
        updateTeam(team.id!, teamState)
            .then((updatedTeam) => {
                setTeamState(updatedTeam);
                setIsEditing(false);
            })
            .catch(error => console.error('Error updating team:', error));
    };

    const handleCancel = () => {
        fetchTeam(team.id!)
            .then((fetchedTeam) => {
                setTeamState(fetchedTeam);
                setIsEditing(false);
            })
            .catch(error => console.error('Error fetching team:', error));
    }

    const formatDateInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <Box mt={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Details</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1}}>
                    {isEditing ? (
                        <>
                            <Button 
                                startIcon={<Save/>} 
                                variant="contained" 
                                size="small"
                                onClick={handleSave}
                                disabled={!!inputError}
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
                        </>  
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
            </Box>
            <Stack gap={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{fontWeight: 'medium'}}>Group:</Typography>
                    {isEditing ? (
                        <Select
                            value={teamState.group.toString()}
                            onChange={handleGroupChange}
                            size="small"
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                        </Select>
                    ) : (
                        <Typography variant="body1">{teamState.group}</Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{fontWeight: 'medium'}}>Registration Date:</Typography>
                    {isEditing ? (
                        <TextField
                            value={formatDateInput(teamState.registrationDate)}
                            onChange={handleRegistrationDateChange}
                            type="date"
                            size="small"
                        />
                    ) : (
                        <Typography variant="body1">{formatDate(teamState.registrationDate)}</Typography>
                    )}
                </Box>
            </Stack>
        </Box>
    );
};




export default TeamDetails;