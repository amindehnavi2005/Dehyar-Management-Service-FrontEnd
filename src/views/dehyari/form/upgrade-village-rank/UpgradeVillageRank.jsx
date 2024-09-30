'use client'
import { Divider, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import UpgradeVillageTable from './list/UpgradeVillageTable';
import UpgradeVillageInformation from './list/UpgradeVillageInformation';

const UpgradeVillageRank = () => {

    const [loading, setLoading] = useState(false);
    const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false)

    const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)


    return (
        <Grid container p={5} borderRadius={2} boxShadow={2} className='bg-backgroundPaper'>
            <div className='w-full h-full md:flex justify-around'>
                <UpgradeVillageInformation />
                <Divider className='bg-backgroundDefault md:w-[3px] sm:w-full md:ml-5' />
                <div className=''>
                    <Typography my={5} variant='h5'>جزئیات محاسبه درجه بندی دهیاری</Typography>
                    <UpgradeVillageTable
                        loading={loading}
                        setLoading={setLoading}
                        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
                        addEventSidebarOpen={addEventSidebarOpen}
                    />
                </div>
            </div>
        </Grid >
    );
}

export default UpgradeVillageRank