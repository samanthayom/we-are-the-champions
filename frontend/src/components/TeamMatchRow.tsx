import React, { useState } from 'react';
import { Match } from '../interfaces';
import { MenuItem, TableCell, TableRow, TextField } from '@mui/material';


interface EditableTeamMatchRowProps {
    teamName: string;
    allTeamNames: string[];
    match: Match;
    onMatchChange: (updatedMatch: Match) => void;
}

interface TeamMatchRowProps {
    teamName: string;
    match: Match;
}


export function EditableTeamMatchRow({teamName, allTeamNames, match, onMatchChange}: EditableTeamMatchRowProps) {
    const [matchState, setMatchState] = useState<Match>(match);

    const opponentTeam = matchState.teams.find(t => t.name !== teamName)!;
    const myTeam = matchState.teams.find(t => t.name === teamName)!;

    const handleScoreChange = (isOpponent: boolean, newScore: number) => {
        const updatedMatch = {
          ...matchState,
          teams: matchState.teams.map(t => 
            t.name === (isOpponent ? opponentTeam.name : myTeam.name)
              ? { ...t, score: newScore }
              : t
          )
        };
        setMatchState(updatedMatch);
        onMatchChange(updatedMatch);
      };

    const handleNameChange = (isOpponent: boolean, newName: string) => {
        const updatedMatch = {
          ...matchState,
          teams: matchState.teams.map(t => 
            t.name === (isOpponent ? opponentTeam.name : myTeam.name)
              ? { ...t, name: newName }
              : t
          )
        };
        setMatchState(updatedMatch);
        onMatchChange(updatedMatch);
    };

    return (
        <TableRow>
            <TableCell align="left">
                <TextField
                    select
                    value={opponentTeam.name}
                    onChange={(e) => handleNameChange(true, e.target.value)}
                    variant="standard"
                    size="small"
                    margin="none"
                >
                {allTeamNames.map((teamName) => (
                    <MenuItem key={teamName} value={teamName}>{teamName}</MenuItem>
                ))}
                </TextField>
            </TableCell>
            <TableCell align="right">
                <TextField
                    value={opponentTeam.score}
                    onChange={(e) => handleScoreChange(true, Number(e.target.value))}
                    variant="standard"
                    type="number"
                    size="small"
                    margin="none"
                    sx={{ width: '50px' }}
                />
            </TableCell>
            <TableCell align="left">
                <TextField
                    value={myTeam.score}
                    onChange={(e) => handleScoreChange(false, Number(e.target.value))}
                    variant="standard"
                    type="number"
                    size="small"
                    margin="none"
                    sx={{ width: '50px' }}
                />
            </TableCell>
        </TableRow>
    )

}


export function TeamMatchRow({teamName, match}: TeamMatchRowProps) {
    const opponentTeam = match.teams.find(t => t.name !== teamName)!;
    const myTeam = match.teams.find(t => t.name === teamName)!;

    return (
        <TableRow>
            <TableCell align='left'>{opponentTeam.name}</TableCell>
            <TableCell align='right'>{opponentTeam.score}</TableCell>
            <TableCell align='left' sx={{fontWeight: 'bold'}}>{myTeam.score}</TableCell>
        </TableRow>
    );
};
