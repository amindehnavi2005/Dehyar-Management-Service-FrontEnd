import React from 'react'
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Controller, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"


const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

const MachineStatus = ({ setData, setStep, onClose, mode, methods }) => {

    const { control, handleSubmit, formState: { errors } } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'machine_status_fields'
    });

    const machineStatus = [
        { value: 0, label: 'مستحلک' },
        { value: 1, label: 'عادی' },
    ]

    const onSubmit = (newData) => {
        console.log("New Data => ", newData);
    }

    console.log("ERRORS => ", errors);


    const renderTextField = (index, itemName, name, label) => {
        return (
            <FormControl fullWidth >
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
                            {...((errors?.machine_status_fields && errors?.machine_status_fields[index] && errors?.machine_status_fields[index]?.[itemName]) && {
                                error: errors?.machine_status_fields[index]?.[itemName],
                                helperText: errors?.machine_status_fields[index]?.[itemName].message
                            })}
                        />
                    )}
                />
            </FormControl>
        )
    }

    const renderDatePicker = (index, itemName, name, label) => (
        <FormControl fullWidth>
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
                                {...((errors?.machine_status_fields && errors?.machine_status_fields[index] && errors?.machine_status_fields[index]?.[itemName]) && {
                                    error: errors?.machine_status_fields[index]?.[itemName],
                                    helperText: errors?.machine_status_fields[index]?.[itemName].message
                                })}
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
        </FormControl>
    );

    const renderSelect = (index, itemName, name, label, option) => (
        <FormControl fullWidth>
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
                        {...((errors?.machine_status_fields && errors?.machine_status_fields[index] && errors?.machine_status_fields[index]?.[itemName]) && {
                            error: errors?.machine_status_fields[index]?.[itemName],
                        })}
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
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            {fields.map((field, index) => (
                <>
                    <div key={field.id} className='md:flex grid mb-2 gap-2'>
                        {renderSelect(index, 'machine_status', `machine_status_fields.${index}.machine_status`, 'وضعیت ماشین آلات', machineStatus)}
                        {renderDatePicker(index, 'status_report_date', `machine_status_fields.${index}.status_report_date`, 'تاریخ اعلام')}
                        {renderTextField(index, 'description', `machine_status_fields.${index}.description`, 'توضیحات')}
                        <Button variant="contained" color="error" onClick={() => remove(index)} >
                            <i className='ri-delete-bin-line'></i>
                        </Button>
                    </div>
                    <Divider sx={{ my: 5 }} />
                </>
            ))}
            <Button
                variant="contained"
                color="inherit"
                onClick={() => append({ machine_status: '', status_report_date: '', description: '' })}
                className='gap-2'
            >
                <i className='ri-add-line'></i>
                افزودن
            </Button>
            <Box display={'flex'} mt={10} gap={5} justifyContent={'space-between'}>
                <Button variant='contained' color='secondary' onClick={() => { setStep(2) }}>برگشت</Button>
                <Button variant="contained" color='success' type="submit" >
                    ثبت
                </Button>
            </Box>
        </Box>
    );
}

export default MachineStatus