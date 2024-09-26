import React from 'react'
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Controller, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

const MachineCost = ({ setData, setStep }) => {

    const { control, handleSubmit, formState: { errors } } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'machine_cost_fields'
    });


    const fundingSources = [
        { value: 0, label: 'مستحلک' },
        { value: 1, label: 'عادی' },
    ]

    const onSubmit = (newData) => {
        console.log("New Data => ", newData);
        if (newData.machine_cost_fields.length) {
            setData(prevValues => ({ ...prevValues, machine_cost_fields: newData.machine_cost_fields }));
            setStep(3)
        } else {
            toast.error("شما باید حداقل یک ردیف ایجاد کنید", {
                position: "top-center",
                duration: 3000,
            })
        }
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
                            {...((errors?.machine_cost_fields && errors?.machine_cost_fields[index] && errors?.machine_cost_fields[index]?.[itemName]) && {
                                error: errors?.machine_cost_fields[index]?.[itemName],
                                helperText: errors?.machine_cost_fields[index]?.[itemName].message
                            })}
                        />
                    )}
                />
            </FormControl>
        )
    }

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
                        {...((errors?.machine_cost_fields && errors?.machine_cost_fields[index] && errors?.machine_cost_fields[index]?.[itemName]) && {
                            error: errors?.machine_cost_fields[index]?.[itemName],
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
                        {renderSelect(index, 'funding_source', `machine_cost_fields.${index}.funding_source`, 'محل تامین مالی', fundingSources)}
                        {renderTextField(index, 'amount', `machine_cost_fields.${index}.amount`, 'مبلغ')}
                        {renderTextField(index, 'description', `machine_cost_fields.${index}.description`, 'توضیحات')}
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
                onClick={() => append({ funding_source: '', amount: '', description: '' })}
                className='gap-2'
            >
                <i className='ri-add-line'></i>
                افزودن
            </Button>
            <Box display={'flex'} mt={10} gap={5} justifyContent={'space-between'}>
                <Button variant='contained' color='secondary' onClick={() => { setStep(1) }}>برگشت</Button>
                <Button variant="contained" type="submit" >
                    بعدی
                </Button>
            </Box>
        </Box>
    );
}

export default MachineCost