import DividerSimple from '@/components/common/Divider/DividerSimple'
import { Box, Grid, Typography } from '@mui/material'
import React from 'react'

const UpgradeVillageInformation = () => {
    return (
        <Grid>
            <Typography variant='h5' textAlign={'center'}>ارتقاء درجه دهیاری <span className='font-bold text-primary'>عباس آباد</span></Typography>
            <div className='my-5'><DividerSimple title={"تقسیمات کشوری"} /></div>
            <Typography fontWeight={'medium'} className='text-textPrimary' display={'flex'} alignItems={'center'} my={2}><i className='ri-building-4-line h-4'></i>استان : <span className='font-medium text-secondary'>ایلام</span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary' display={'flex'} alignItems={'center'} my={2}><i className='ri-building-2-line h-4'></i>شهرستان : <span className='font-medium text-secondary'></span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary' display={'flex'} alignItems={'center'} my={2}><i className='ri-building-line h-4'></i>بخش : <span className='font-medium text-secondary'></span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary' display={'flex'} alignItems={'center'} my={2}><i className='ri-hotel-line h-4'></i>دهستان : <span className='font-medium text-secondary'></span></Typography>
            <div className='my-5'><DividerSimple title={"درجه دهیاری"} /></div>
            <Typography fontWeight={'medium'} className='text-textPrimary' display={'flex'} alignItems={'center'} my={2}><i class="ri-medal-line h-4"></i>درجه فعلی : <span className='font-medium text-secondary'>ایلام</span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary' display={'flex'} alignItems={'center'} my={2}><i class="ri-calendar-line h-4"></i>تاریخ : <span className='font-medium text-secondary'></span></Typography>
            <Typography fontWeight={'medium'} className='text-textPrimary' display={'flex'} alignItems={'center'} my={2}><i class="ri-verified-badge-line h-4"></i>درجه نهایی : <span className='font-medium text-secondary'></span></Typography>
            <Box textAlign={'center'} className="bg-primary text-backgroundPaper rounded-xl my-5 p-2">265 روز</Box>
        </Grid>
    )
}

export default UpgradeVillageInformation