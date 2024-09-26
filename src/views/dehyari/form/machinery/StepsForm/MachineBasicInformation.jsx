import DividerSimple from '@/components/common/Divider/DividerSimple';
import { getMachineBasicInformation, getMachineInformation } from '@/Services/Machine';
import api from '@/utils/axiosInstance';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form';

const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

const MachineBasicInformation = ({ setData }) => {

    const { control, formState: { errors } } = useFormContext();

    const [basicInformation, setBasicInformation] = useState([]);

    const fetchMachineBasicInformation = async () => {
        await api.get(getMachineBasicInformation(), { requiresAuth: true })
            .then((response) => {
                setBasicInformation(response.data.data)
                console.log(response.data);
                console.log("Response => ", response.data.data);
            })
    }

    useEffect(() => {
        fetchMachineBasicInformation();
    }, []);

    return (
        <Controller
            name='machine_basic_id'
            control={control}
            defaultValue={null}
            render={({ field }) => {
                const selectedOption = basicInformation.find(
                    option => option.id === field.value?.id
                );

                return (
                    <Autocomplete
                        {...field}
                        options={basicInformation}
                        getOptionLabel={(option) => `${option.category} - ${option.type} - ${option.title}`}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                        }
                        onChange={(event, newValue) => {
                            setData(prevValues => ({ ...prevValues, machine_basic_id: newValue.id }));
                            field.onChange(newValue && newValue.id || null);
                            console.log("New Value => ", newValue.id);
                        }}
                        value={selectedOption}
                        renderInput={(params) => (
                            <TextField
                                autoComplete="off"
                                {...params}
                                label="اطلاعات پایه (دسته بندی - نوع - عنوان)"
                                size="small"
                                fullWidth
                                error={errors.machine_basic_id}
                            />
                        )}
                    />
                );
            }}
        />
    )
}

export default MachineBasicInformation