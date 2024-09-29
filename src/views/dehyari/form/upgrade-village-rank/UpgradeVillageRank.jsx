'use client'
import { Divider, Grid } from '@mui/material'
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
                <Divider className='bg-secondary md:w-[2px] sm:w-full md:ml-5' />
                <UpgradeVillageTable
                    loading={loading}
                    setLoading={setLoading}
                    handleAddEventSidebarToggle={handleAddEventSidebarToggle}
                    addEventSidebarOpen={addEventSidebarOpen}
                />
            </div>
        </Grid >
    );
}

export default UpgradeVillageRank