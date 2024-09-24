import DividerSimple from '@/components/common/Divider/DividerSimple';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

const MachineInformation = ({ setData, setStep }) => {

    const { control, handleSubmit, formState: { errors } } = useFormContext();

    const fuels = [
        { value: 0, lable: 'بنزینی' },
        { value: 1, lable: 'گازوئیلی' },
        { value: 2, lable: 'ترکیبی' },
    ]

    const onSubmit = (data) => {
        setStep(2);
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

    const renderDatePicker = (name, label) => (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <DatePicker
                    value={value}
                    calendar={persian}
                    locale={persian_fa}
                    onChange={date => {
                        const newDate = `${date.year}/${date.month}/${date.day}`
                        console.log("New Date => ", newDate);
                        setTimeout(() => {
                            setData(prevValues => ({ ...prevValues, [name]: newDate }));
                            onChange(newDate)
                        }, 0);
                    }
                    }
                    render={(value, onChange) => (
                        <TextField
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
                render={({ field: { value = '', onChange } }) => (
                    <Select
                        value={value}
                        label={label}
                        onChange={e => {
                            const newValue = e.target.value;
                            setTimeout(() => {
                                setData(prevValues => ({ ...prevValues, [name]: newValue }));
                                onChange(newValue)
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
            <Grid item xs={12} mb={5}>
                <DividerSimple title={'اطلاعات مورد نظر خودتان را انتخاب کنید'} />
            </Grid>
            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <Grid container gap={5}>
                    <div className='grid md:grid-cols-3 w-full gap-5'>
                        {renderTextField('system', 'سیستم', 'سیستم الزامی است')}
                        {renderTextField('engine_number', 'شماره موتور', 'شماره موتور الزامی است')}
                        {renderTextField('manufacturing_year', 'سال ساخت', 'سال ساخت الزامی است')}
                        {renderTextField('chassis_number', 'شماره شاسی', 'شماره شاسی الزامی است')}
                        {renderTextField('number_of_cylinders', 'تعداد سیلندر', 'تعداد سیلندر الزامی است')}
                        {renderTextField('capacity', 'ظرفیت (نفر)', 'ظرفیت الزامی است')}
                        {renderTextField('number_of_axles', 'تعداد محور', 'تعداد محور الزامی است')}
                        {renderTextField('color', 'رنگ', 'رنگ الزامی است')}
                        {renderTextField('fuel', 'سوخت', 'سوخت الزامی است')}
                        {renderDatePicker('delivery_date', 'تاریخ تحویل', 'تاریخ تحویل الزامی است')}
                        {renderTextField('plate_type', 'نوع پلاک', 'نوع پلاک الزامی است')}
                        {renderTextField('registration_plate', 'پلاک انتظامی', 'پلاک انتظامی الزامی است')}
                    </div>
                </Grid>
                <Box display={'flex'} mt={2} gap={5} justifyContent={'end'} >
                    <Button variant='contained' color='secondary' onClick={() => setStep(0)} >بازگشت</Button>
                    <Button variant='contained' color='primary' type='submit' >بعدی</Button>
                </Box>
            </form>
        </Grid>
    )
}

export default MachineInformation