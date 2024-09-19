// React Imports
import React, { useState } from 'react'

// MUI Imports
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'

// ThirdParty Imports
import { minLength, object, string } from 'valibot';
import { Controller, useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';

// Component Imports
import DividerSimple from '@/components/common/Divider/DividerSimple'
import PersianDatePicker from '../PersianDatePicker';

const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};


const StepBasicInformation = ({ data, setData, step, setStep }) => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            hierarchical_code: data.hierarchical_code,
            village_code: data.village_code,
            nid: data.nid,
            wide: data.wide,
            centrality_status: data.centrality_status,
            tourism_status: data.tourism_status,
            postal_code: data.postal_code,
            fire_station: data.fire_station,
            dehyari_status: data.dehyari_status,
        }
    });

    const centralityStatus = [
        { value: 0, label: "نمیباشد" },
        { value: 1, label: "دهستان" },
        { value: 2, label: "بخش" },
        { value: 3, label: "شهرستان" },
        { value: 4, label: "استان" },
    ]

    const dehyariStatus = [
        { value: 0, label: "استان" },
        { value: 1, label: "شهرستان" },
        { value: 2, label: "بخش" },
        { value: 3, label: "دهستان" },
        { value: 4, label: "روستا" },
    ]

    const tourismStatus = [
        { value: 0, label: "نمیباشد" },
        { value: 1, label: "میباشد" }
    ]

    const [errorState, setErrorState] = useState(null)

    const renderTextField = (name, label, errorText) => (
        <FormControl fullWidth className='mbe-5'>
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                    <TextField
                        label={label}
                        value={value}
                        onChange={(e) => {
                            const value = persianToEnglishDigits(e.target.value);
                            setData(prevValues => ({ ...prevValues, [name]: value }));
                            onChange(value);
                            errorState !== null && setErrorState(null);
                        }}
                        error={!!errors[name]}
                        helperText={errors[name] ? errorText : ''}
                    />
                )}
            />
        </FormControl>
    );

    const renderSelect = (name, label, option, errorText) => (
        <FormControl error={!data[name]} >
            <InputLabel id={name}>{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label={label}
                        onChange={e => {
                            const newValue = e.target.value;
                            setTimeout(() => {
                                setData(prevValues => ({ ...prevValues, [name]: newValue }));
                                field.onChange(e);
                            }, 0);
                        }}
                        fullWidth
                    >
                        {Object.entries(option.map(({ value, label }) => (
                            <MenuItem key={value} value={label}>{label}</MenuItem>
                        )))}
                    </Select>
                )}
            />
            {!data[name] && <FormHelperText>{errorText}</FormHelperText>}
        </FormControl>
    )

    const onSubmit = data => {
        console.log(data);
    }

    return (
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12} mb={5}>
                <DividerSimple title={data.organization_type} />
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-5'>
                    {renderTextField('hierarchical_code', 'کد سلسله مراتبی', 'کد سلسله مراتبی الزامی است')}
                    {renderTextField('village_code', 'کد آبادی', 'کد آبادی مراتبی الزامی است')}
                    {renderTextField('nid', 'شناسه ملی', 'شناسه ملی مراتبی الزامی است')}
                    {renderSelect('dehyari_status', 'انتخاب دهیاری', dehyariStatus, 'انتخاب دهیاری الزامی است')}
                    {renderTextField('wide', 'وسعت (هکتار)', 'وسعت الزامی است')}
                    {renderSelect('centrality_status', 'مرکزیت', centralityStatus, 'مرکزیت الزامی است')}
                    {renderSelect('tourism_status', 'هدف گردشگری', tourismStatus, 'هدف گردشگری الزامی است')}
                    {renderTextField('postal_code', 'کد پستی', 'کد پستی الزامی است')}
                    {renderTextField('fire_station', 'پایگاه آتش نشانی', 'پایگاه آتش نشانی الزامی است')}
                    <PersianDatePicker />
                </div>
                <Box display={'flex'} mt={2} gap={5} justifyContent={'center'} >
                    <Button variant='contained' color='secondary' onClick={() => { setStep(step - 1) }}>برگشت</Button>
                    <Button type='submit' variant='contained' color='primary' >بعدی</Button>
                    {/* <Button variant='contained' color='success' onClick={() => { }}>ثبت</Button> */}
                </Box>
            </form>
        </Grid>
    )
}

export default StepBasicInformation