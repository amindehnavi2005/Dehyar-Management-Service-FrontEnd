import DividerSimple from '@/components/common/Divider/DividerSimple';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import PlateCreator from './PlateCreator';
import MachineBasicInformation from './MachineBasicInformation';

const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

const MachineInformation = ({ setData, setStep }) => {

    const { control, handleSubmit, formState: { errors } } = useFormContext();

    const systems = [
        { value: 0, label: 'ساده' },
        { value: 1, label: 'جک دار' },
    ];

    const fuels = [
        { value: 0, label: 'بنزینی' },
        { value: 1, label: 'گازوئیلی' },
        { value: 2, label: 'ترکیبی' },
    ];

    const onSubmit = (data) => {
        console.log("Data=>", data);
        setStep(prevStep => prevStep + 1);
    }

    const renderTextField = (name, label) => (
        <Controller
            name={name}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    autoComplete="off"
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

    const renderDatePicker = (name, label) => (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <DatePicker
                    value={value ? new Date(value * 1000) : ""}
                    calendar={persian}
                    locale={persian_fa}
                    onChange={date => {
                        // const newDate = `${date.year}/${date.month}/${date.day}`
                        setTimeout(() => {
                            setData(prevValues => ({ ...prevValues, [name]: date.toUnix() }));
                            onChange(date ? date.toUnix() : '');
                        }, 0);
                    }
                    }
                    render={(value, onChange) => (
                        <TextField
                            autoComplete="off"
                            label={label}
                            value={value}
                            error={errors[name]}
                            helperText={errors?.[name]?.message}
                            onClick={e => {
                                const newValue = persianToEnglishDigits(e.target.value);
                                setTimeout(() => {
                                    setData(prevValues => ({ ...prevValues, [name]: newValue }));
                                    onChange(newValue)
                                }, 0);
                            }}
                            InputProps={
                                { style: { height: 45 }, inputProps: { style: { textAlign: 'center' } } }
                            }
                            fullWidth
                        />
                    )}
                />
            )}
        />
    );

    const renderSelect = (name, label, option) => (
        <FormControl fullWidth  >
            <InputLabel id={name}>{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field: { value, onChange } }) => (
                    <Select
                        value={value}
                        label={label}
                        onChange={e => {
                            const newValue = e.target.value;
                            setTimeout(() => {
                                setData(prevValues => ({ ...prevValues, [name]: newValue }));
                                onChange(newValue)
                                console.log("Data =>", newValue);
                                console.log("Errors => ", errors[name]);

                            }, 0);
                        }}
                        fullWidth
                        error={errors[name]}
                        sx={{ height: 45 }}
                    >
                        {Object.entries(option.map(({ value, label }) => (
                            <MenuItem key={value} value={value}>{label}</MenuItem>
                        )))}
                    </Select>
                )}
            />
        </FormControl>
    )

    return (
        <Grid container spacing={2} mt={1}>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <Grid container gap={5}>
                    <div className='grid md:grid-cols-3 w-full gap-5'>
                        <MachineBasicInformation setData={setData} />
                        {renderSelect('system', 'سیستم', systems)}
                        {renderTextField('engine_number', 'شماره موتور', 'شماره موتور الزامی است')}
                        {renderTextField('manufacturing_year', 'سال ساخت', 'سال ساخت الزامی است')}
                        {renderTextField('chassis_number', 'شماره شاسی', 'شماره شاسی الزامی است')}
                        {renderTextField('number_cylinders', 'تعداد سیلندر', 'تعداد سیلندر الزامی است')}
                        {renderTextField('capacity', 'ظرفیت (نفر)', 'ظرفیت الزامی است')}
                        {renderTextField('number_axles', 'تعداد محور', 'تعداد محور الزامی است')}
                        {renderTextField('color', 'رنگ', 'رنگ الزامی است')}
                        {renderSelect('fuel', 'سوخت', fuels)}
                        {renderDatePicker('delivery_date', 'تاریخ تحویل', 'تاریخ تحویل الزامی است')}
                        <PlateCreator setData={setData} />
                    </div>
                </Grid>
                <Box display={'flex'} mt={2} gap={5} justifyContent={'end'} >
                    <Button variant='contained' color='primary' type='submit' >بعدی</Button>
                </Box>
            </form>
        </Grid>
    )
}

export default MachineInformation