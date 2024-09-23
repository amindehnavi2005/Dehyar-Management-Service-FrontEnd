import DividerSimple from '@/components/common/Divider/DividerSimple';
import { Box, Button, Grid, TextField } from '@mui/material';
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';

const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

const MachineBasicInformation = ({ setData, setStep }) => {

    const { control, handleSubmit, formState: { errors } } = useFormContext();

    const onSubmit = (data) => {
        setStep(1);
    }

    const renderTextField = (name, label) => (
        <Controller
            name={name}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    InputProps={
                        { style: { height: 45 }, inputProps: { style: { textAlign: 'center' } } }
                    }
                    label={label}
                    value={value}
                    onChange={(e) => {
                        const value = persianToEnglishDigits(e.target.value);
                        setData(prevValues => ({ ...prevValues, [name]: value }));
                        onChange(value);
                    }}
                    fullWidth
                    error={errors[name]}
                    helperText={errors?.[name]?.message}
                />
            )}
        />
    );

    return (
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12} mb={5}>
                <DividerSimple title={'اطلاعات مورد نظر خودتان را انتخاب کنید'} />
            </Grid>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <Grid container gap={5}>
                    <div className='grid md:grid-cols-3 w-full gap-5'>
                        {renderTextField('category', 'دسته بندی', 'دسته بندی الزامی است')}
                        {renderTextField('machine_type', 'نوع', 'نوع الزامی است')}
                        {renderTextField('machine_title', 'عنوان ماشین آلات', 'عنوان ماشین آلات الزامی است')}
                    </div>
                </Grid>
                <Box display={'flex'} mt={2} gap={5} justifyContent={'end'} >
                    <Button variant='contained' color='primary' type='submit' >بعدی</Button>
                </Box>
            </form>
        </Grid>
    )
}

export default MachineBasicInformation