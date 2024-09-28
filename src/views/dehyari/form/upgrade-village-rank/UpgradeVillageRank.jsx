import { Divider, Grid } from '@mui/material'
import React from 'react'

const UpgradeVillageRank = () => {
    return (
        <Grid container p={5} borderRadius={2} boxShadow={2} className='bg-backgroundPaper'>
            <div className='w-full h-full md:flex'>
                <Grid className='flex-[1]'>SSS</Grid>
                <Divider className='bg-backgroundDefault md:w-[2px] sm:w-full md:ml-5' />
                <Grid className='flex-[2]'>SSS</Grid>
            </div>
        </Grid >
    );
}

export default UpgradeVillageRank