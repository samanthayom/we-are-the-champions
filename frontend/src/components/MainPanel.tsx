import { Stack } from '@mui/material';
import GroupRankings from './Rankings';
import Teams from './Teams';


function MainPanel() {
    return (
        <Stack spacing={6} sx={{ mt: 6 }}>
            <GroupRankings />
            <Teams />
        </Stack>
    );
}

export default MainPanel;