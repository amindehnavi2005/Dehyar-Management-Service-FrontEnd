import DividerSimple from '@/components/common/Divider/DividerSimple';
import { Box, Button, Grid, TextField } from '@mui/material';
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';

const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

const MachineBasicInformation = () => {

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useFormContext();

    const onSubmit = () => { }

    const renderTextField = (name, label, errorText) => (
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
                <DividerSimple title={'سازمان مورد نظر خودتان را انتخاب کنید'} />
            </Grid>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <Grid container gap={5}>
                    <div className='grid md:grid-cols-4 w-full gap-5'>
                        {renderTextField('hierarchical_code', 'کد سلسله مراتبی', 'کد سلسله مراتبی الزامی است')}
                        {renderTextField('village_code', 'کد آبادی', 'کد آبادی مراتبی الزامی است')}
                        {renderTextField('nid', 'شناسه ملی', 'شناسه ملی مراتبی الزامی است')}
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