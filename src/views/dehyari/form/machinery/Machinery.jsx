'use client'

// React Imports
import React, { useEffect, useState } from 'react'

// MUI Imports
import { Box, Button, Divider, Grid, Modal, Paper } from '@mui/material';

// Component Imports
// import StepBasicInformation from './StepsForm/StepBasicInformation';
// import StepPopulationNew from './StepsForm/StepPopulationNew';
// import StepIncomeNew from './StepsForm/StepIncomeNew';
// import GradingTable from './list/GradingTable';
import { FormProvider, useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { maxLength, minLength, object, string, array, number } from 'valibot';
import MachineBasicInformation from './StepsForm/MachineBasicInformation';
import MachineList from './list/MachineList';

const schemas = [
    object({
        category: string([minLength(1, 'این فیلد الزامی است')]),
        machine_type: string([minLength(1, 'این فیلد الزامی است')]),
        machine_title: string([minLength(1, 'این فیلد الزامی است')]),
    }),
]

const Machinery = () => {
    const [step, setStep] = useState(0);
    const methods = useForm({
        resolver: valibotResolver(schemas[step]),
        defaultValues: {
            id: Date.now(),
            category: '',
            machine_type: '',
            machine_title: '',
        }
    })
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('add');
    const [data, setData] = useState(methods);



    const handleOpenForm = () => setOpenModal(true);
    const handleCloseForm = () => {
        methods.reset();
        setStep(0);
        setOpenModal(false);
    };

    const steps = [
        { step: 1, name: "اطلاعات پایه ماشین آلات", content: (<MachineBasicInformation setData={setData} setStep={setStep} />) },
        // { step: 2, name: "ثبت اطلاعات ماشین", content: (<MachineBasicInformation setData={setData} setStep={setStep} />) },
        // { step: 3, name: "بهای تمام شده ماشین", content: (<MachineBasicInformation setData={setData} setStep={setStep} />) },
        // { step: 4, name: "وضعیت ماشین", content: (<StepIncomeNew data={data} setData={setData} step={step} setStep={setStep} onClose={handleCloseForm} users={users} setUsers={setUsers} mode={mode} methods={methods} />) }
    ];


    return (
        <>
            <MachineList handleOpenModal={handleOpenForm} setData={setData} setMode={setMode} methods={methods} loading={loading} setLoading={setLoading} />
            <Modal open={openModal} onClose={handleCloseForm} style={{ margin: '2%' }}>
                <Paper style={{ maxHeight: '100%', overflowY: 'auto' }}>
                    <div className='bg-backgroundPaper h-full lg:h-auto rounded-2xl'>
                        <Button className='absolute left-0' onClick={handleCloseForm}><i className='ri-close-fill' /></Button>
                        <Grid container p={5} py={10} >
                            <Grid display={'flex'} item xs={12} gap={2} justifyContent={'center'}>
                                {steps.map((currentStep) => (
                                    <div className={`flex ${currentStep.step == steps[step].step ? 'border-primary text-primary font-bold' : 'sm:flex hidden'} gap-2 items-center justify-between `}>
                                        <div className={`flex rounded-full justify-center items-center h-8 w-8  ${currentStep.step == steps[step].step ? 'border-primary text-primary' : 'border-secondary text-secondary'} font-bold border-4`}>{currentStep.step}</div>
                                        <div>{currentStep.name}</div>
                                        {currentStep.step !== steps.length ? <div className='sm:block hidden text-secondary font-medium'>------------------------------------------------------</div> : ''}
                                    </div>
                                ))}
                            </Grid>
                            <div className='border-2 p-5 w-full m-5 rounded-2xl'>
                                <FormProvider {...methods}>
                                    {steps[step].content}
                                </FormProvider>
                            </div>
                        </Grid>
                    </div>
                </Paper>
            </Modal >
        </>
    )
}
export default Machinery