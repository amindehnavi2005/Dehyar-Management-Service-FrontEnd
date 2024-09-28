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
import MachineInformation from './StepsForm/MachineInformation';
import MachineCost from './StepsForm/MachineCost';
import MachineStatus from './StepsForm/MachineStatus';
import ViewMachineInformation from './list/ViewMachineInformation';

const schemas = [
    object({
        machine_basic_id: number(minLength(1, 'انتخاب اطلاعات پایه الزامی است')),
        system: number(minLength(1, 'این فیلد الزامی است')),
        engine_number: string([minLength(1, 'این فیلد الزامی است')]),
        manufacturing_year: string([
            minLength(1, 'این فیلد الزامی است'),
            minLength(4, 'سال ساخت باید 4 رقمی وارد شود'),
            maxLength(4, 'سال ساخت نمیتواند بیشتر از 4 رقم باشد')
        ]),
        chassis_number: string([minLength(1, 'این فیلد الزامی است')]),
        number_cylinders: string([
            minLength(1, 'این فیلد الزامی است'),
            maxLength(2, 'تعداد سیلندر نمیتواند بیشتر از 2 رقم داشته باشد')
        ]),
        capacity: string([
            minLength(1, 'این فیلد الزامی است'),
            maxLength(2, 'ظرفیت نمیتواند بیشتر از 2 رقم داشته باشد')
        ]),
        number_axles: string([
            minLength(1, 'این فیلد الزامی است'),
            maxLength(2, 'تعداد محور ها نمیتواند بیش از 1 رقم داشته باشد'),
        ]),
        color: string([minLength(1, 'این فیلد الزامی است')]),
        fuel: number(minLength(1, 'این فیلد الزامی است')),
        delivery_date: number(minLength(1, 'این فیلد الزامی است')),
        plate_province_code: string([minLength(2, 'الزامی')]),
        plate_category_letter: number(minLength(1, 'این فیلد الزامی است')),
        plate_uniqe_identifier: string([minLength(3, 'الزامی')]),
        plate_registration_number: string([minLength(2, 'الزامی')]),
    }),
    object({
        machine_cost_fields:
            array(
                object({
                    funding_source: number(minLength(1, 'این فیلد الزامی است')),
                    amount: string([
                        minLength(1, 'این فیلد الزامی است'),
                        maxLength(20, 'مبلغ نمیتواند بیش از 20 رقم داشته باشد'),
                    ]),
                    description: string([minLength(1, 'این فیلد الزامی است')]),
                })
            ),
    }),
]

const Machinery = () => {
    const [step, setStep] = useState(0);
    const methods = useForm({
        resolver: valibotResolver(schemas[step]),
        defaultValues: {
            id: Date.now(),
            machine_basic_id: '',
            system: '',
            engine_number: '',
            manufacturing_year: '',
            chassis_number: '',
            number_cylinders: '',
            capacity: '',
            number_axles: '',
            color: '',
            fuel: '',
            delivery_date: '',
            plate_province_code: '',
            plate_category_letter: '',
            plate_uniqe_identifier: '',
            plate_registration_number: '',
            machine_cost_fields: [{ funding_source: '', amount: '', description: '' }]
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
        { step: 1, name: "ثبت اطلاعات ماشین", content: (<MachineInformation setData={setData} setStep={setStep} />) },
        { step: 2, name: "بهای تمام شده ماشین", content: (<MachineCost data={data} setData={setData} setStep={setStep} onClose={handleCloseForm} mode={mode} methods={methods} />) },
        { step: 3, name: "نمایش اطلاعات ماشین", content: (<ViewMachineInformation onClose={handleCloseForm} data={data} />) }
        // { step: 4, name: "وضعیت ماشین", content: (<MachineStatus setData={setData} setStep={setStep} onClose={handleCloseForm} mode={mode} methods={methods} />) }
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
                                    <div className={`flex ${currentStep.step == steps[step].step ? 'border-primary text-primary font-bold' : 'md:flex hidden'} gap-2 items-center justify-between `}>
                                        <div className={`flex rounded-full justify-center items-center h-8 w-8  ${currentStep.step == steps[step].step ? 'border-primary text-primary' : 'border-secondary text-secondary'} font-bold border-4`}>{currentStep.step}</div>
                                        <div>{currentStep.name}</div>
                                        {currentStep.step !== steps.length ? <div className='md:block hidden text-secondary font-medium'>----------</div> : ''}
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