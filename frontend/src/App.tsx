import React from 'react';
import { Container } from '@mui/material';
import MainPanel from './components/MainPanel';
import './App.css';
import { TeamAndRankingProvider } from './contexts/TeamAndRankingContext';

function App() {
    return (
        <TeamAndRankingProvider>
            <Container>
                <MainPanel />
            </Container>
        </TeamAndRankingProvider>
    );
}

export default App;