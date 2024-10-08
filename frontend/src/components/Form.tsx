import React, { useState } from 'react';
import { 
    Alert,
    Box, 
    Button, 
    Step, 
    StepLabel,
    Stepper, 
    TextField, 
    Typography 
} from '@mui/material';

import { Team } from '../interfaces';
import { parseTeamsInput, parseMatchesInput } from '../utils';
import { deleteTeams, postTeams } from '../api/teams';
import { postMatches } from '../api/matches';

interface FormProps {
    onClose: () => void;
}

const steps = ['Enter Teams', 'Enter Match Results'];

function Form({ onClose }: FormProps) {
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamsInput, setTeamsInput] = useState('');
    const [resultsInput, setResultsInput] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const isLastStep = () => activeStep === steps.length - 1;

    const handleNext = () => {
        try {
            const teams = parseTeamsInput(teamsInput);
            setTeams(teams);
            setError(null);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async () => {
        try {
            const matches = parseMatchesInput(resultsInput);
            setError(null);
            await postTeams(teams);

            try{
                await postMatches(matches);
                onClose();
            } catch (error) {
                // Rollback if match creation fails
                await deleteTeams();
                console.error(error);
                setError(error instanceof Error ? error.message : 'An unexpected error occurred');
            }
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ mt: 2 }}>
                <Typography sx={{ mb: 1 }}>Step {activeStep + 1}</Typography>
                <TextField
                    label={steps[activeStep]}
                    multiline
                    rows={6}
                    value={activeStep === 0 ? teamsInput : resultsInput}
                    onChange={(e) => activeStep === 0 ? setTeamsInput(e.target.value) : setResultsInput(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 , gap: 1}}>
                    {isLastStep() ? (
                        <>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                            >
                                Back
                            </Button>       
                            <Button variant="contained" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleNext}>
                                Next
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default Form;