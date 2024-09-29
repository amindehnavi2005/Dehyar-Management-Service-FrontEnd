import DividerSimple from '@/components/common/Divider/DividerSimple'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

const UpgradeVillageInformation = () => {
    return (
        <Grid>
            <Typography variant='h4' textAlign={'center'}>ارتقاء درجه دهیاری <span className='font-bold text-primary'>عباس آباد</span></Typography>
            <div className='my-5'><DividerSimple title={"تقسیمات کشوری"} /></div>
            <Typography fontWeight={'medium'} className='text-textPrimary'>استان : <span className='font-medium text-secondary'>ایلام</span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary'>شهرستان : <span className='font-medium text-secondary'></span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary'>بخش : <span className='font-medium text-secondary'></span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary'>دهستان : <span className='font-medium text-secondary'></span></Typography>
            <div className='my-5'><DividerSimple title={"درجه دهیاری"} /></div>
            <Typography fontWeight={'medium'} className='text-textPrimary'>درجه فعلی : <span className='font-medium text-secondary'>ایلام</span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary'>تاریخ : <span className='font-medium text-secondary'></span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary'>درجه نهایی : <span className='font-medium text-secondary'></span></Typography>
            <Box textAlign={'center'} className="bg-primary text-backgroundPaper rounded-xl my-5 p-2">265 روز</Box>
        </Grid>
    )
}

export default UpgradeVillageInformation