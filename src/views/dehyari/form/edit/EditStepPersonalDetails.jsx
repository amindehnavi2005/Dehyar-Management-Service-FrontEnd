import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import DividerSimple from '@components/common/Divider/DividerSimple';
import Autocomplete from '@mui/material/Autocomplete';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useFetchCities } from '@hooks/useFetchCities';
import Chip from '@mui/material/Chip';
import PersonalOptions from '@data/PersonalOption.json';
import { toast } from 'react-toastify';

const EditStepPersonalDetails = ({ validation }) => {
    const { control, register, getValues, setValue, formState: { errors } } = useFormContext();
    const { cities, isLoading, error } = useFetchCities(true);

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[0-9]{1,11}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error('شماره تلفن باید حداکثر ۱۱ رقم و فقط شامل اعداد انگلیسی باشد', {
                position: "top-center"
            });
            return false;
        }
        return true;
    };

    const handlePhoneKeyDown = (event, field, params) => {
        const phoneValue = params.inputProps.value;

        if ((event.key === 'Tab' || event.key === 'Enter') || phoneValue.length === 10) {
            event.preventDefault();
            if (validatePhoneNumber(phoneValue)) {
                const currentValues = Array.isArray(field.value) ? field.value : [];
                const newValue = [...currentValues, phoneValue];
                setValue('phoneNumbers', newValue);
                field.onChange(newValue);
                params.inputProps.onChange({ target: { value: '' } });
            } else {
                const newValue = Array.isArray(field.value) ? field.value.filter(phone => phone !== phoneValue) : [];
                setValue('phoneNumbers', newValue);
                field.onChange(newValue);
            }
        }
    };

    return (
        <>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                    <DividerSimple title='اطلاعات شخصی' />
                </Grid>

                {/* نام و نام خانوادگی */}
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="fullName"
                        control={control}
                        defaultValue=""
                        rules={validation.fullName}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                size="small"
                                label="نام و نام خانوادگی"
                                placeholder="نام و نام خانوادگی"
                                {...field}
                                error={!!errors.fullName}
                                helperText={errors.fullName && errors.fullName.message}
                            />
                        )}
                    />
                </Grid>

                {/* نام پدر */}
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="fatherName"
                        control={control}
                        defaultValue=""
                        rules={validation.fatherName}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                size="small"
                                label="نام پدر"
                                placeholder="نام پدر"
                                {...field}
                                error={!!errors.fatherName}
                                helperText={errors.fatherName && errors.fatherName.message}
                            />
                        )}
                    />
                </Grid>

                {/* کد ملی */}
                <Grid item xs={12} sm={4}>
                    <Controller
                        name='nationalCode'
                        control={control}
                        defaultValue=""
                        rules={validation.nationalCode}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                size="small"
                                label="کد ملی"
                                placeholder="کد ملی"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                                value={field.value || ''}
                                error={!!errors.nationalCode}
                                helperText={errors.nationalCode && errors.nationalCode.message}
                            />
                        )}
                    />
                </Grid>

                {/* تاریخ تولد */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                        <Controller
                            name="birthDate"
                            control={control}
                            defaultValue=""
                            rules={validation.birthDate}
                            render={({ field: { onChange, value } }) => (
                                <DatePicker
                                    value={value ? new Date(value * 1000) : ""}
                                    onChange={(date) => onChange(date ? date.toUnix() : "")}
                                    calendar={persian}
                                    locale={persian_fa}
                                    calendarPosition="bottom-right"
                                    render={
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="تاریخ تولد"
                                            error={!!errors.birthDate}
                                            helperText={errors.birthDate && errors.birthDate.message}
                                            inputProps={{
                                                style: { textAlign: 'end' }
                                            }}
                                        />
                                    }
                                />
                            )}
                        />
                    </FormControl>
                </Grid>

                {/* شماره شناسنامه */}
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="personalId"
                        control={control}
                        defaultValue=""
                        rules={validation.personalId}
                        render={({ field }) => (
                            <TextField
                                fullWidth
                                size="small"
                                label="شماره شناسنامه"
                                placeholder="شماره شناسنامه"
                                {...field}
                                error={!!errors.personalId}
                                helperText={errors.personalId && errors.personalId.message}
                            />
                        )}
                    />
                </Grid>

                {/* محل تولد */}
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="birthPlace"
                        control={control}
                        defaultValue=""
                        rules={validation.birthPlace}
                        render={({ field }) => (
                            <Autocomplete
                                options={cities}
                                value={cities.find(option => option.hierarchy_code === field.value) || null} // تنظیم مقدار پیش‌فرض
                                getOptionLabel={(option) => `${option.state.approved_name}-${option.approved_name}`}
                                isOptionEqualToValue={(option, value) => option.hierarchy_code === value} // مقایسه درست آیتم
                                onChange={(event, newValue) => {
                                    field.onChange(newValue ? newValue.hierarchy_code : '');
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        {...field}
                                        size="small"
                                        label='محل تولد'
                                        error={!!errors.birthPlace}
                                        helperText={errors.birthPlace && errors.birthPlace.message}
                                    />
                                )}
                            />
                        )}
                    />
                </Grid>

                {/* محل صدور */}
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="issuancePlace"
                        control={control}
                        defaultValue=""
                        rules={validation.issuancePlace}
                        render={({ field }) => (
                            <Autocomplete
                                options={cities}
                                value={cities.find(option => option.hierarchy_code === field.value) || null} // تنظیم مقدار پیش‌فرض
                                getOptionLabel={(option) => `${option.state.approved_name}-${option.approved_name}`}
                                isOptionEqualToValue={(option, value) => option.hierarchy_code === value} // مقایسه درست آیتم
                                onChange={(event, newValue) => {
                                    field.onChange(newValue ? newValue.hierarchy_code : '');
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        {...field}
                                        size="small"
                                        label='محل صدور شناسنامه'
                                        error={!!errors.issuancePlace}
                                        helperText={errors.issuancePlace && errors.issuancePlace.message}
                                    />
                                )}
                            />
                        )}
                    />
                </Grid>

                {/* جنسیت */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" error={!!errors.gender}>
                        <InputLabel>جنسیت</InputLabel>
                        <Controller
                            name="gender"
                            control={control}
                            defaultValue=""
                            rules={validation.gender}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="جنسیت"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    value={field.value}
                                >
                                    {PersonalOptions.genderOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* وضعیت تاهل */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" error={!!errors.maritalStatus}>
                        <InputLabel>وضعیت تاهل</InputLabel>
                        <Controller
                            name="maritalStatus"
                            control={control}
                            defaultValue=""
                            rules={validation.maritalStatus}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="وضعیت تاهل"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    value={field.value}
                                >
                                    {PersonalOptions.maritalStatusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.maritalStatus && <FormHelperText>{errors.maritalStatus.message}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* وضعیت ایثارگری */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" error={!!errors.veteranStatus}>
                        <InputLabel>وضعیت ایثارگری</InputLabel>
                        <Controller
                            name="veteranStatus"
                            control={control}
                            defaultValue=""
                            rules={validation.veteranStatus}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="وضعیت ایثارگری"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    value={field.value}
                                >
                                    {PersonalOptions.veteranStatusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.veteranStatus && <FormHelperText>{errors.veteranStatus.message}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* نظام وظیفه */}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" error={!!errors.militaryService}>
                        <InputLabel>نظام وظیفه</InputLabel>
                        <Controller
                            name="militaryService"
                            control={control}
                            defaultValue=""
                            rules={validation.militaryService}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label="نظام وظیفه"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    value={field.value}
                                >
                                    {PersonalOptions.militaryServiceOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.militaryService && <FormHelperText>{errors.militaryService.message}</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
};

export default EditStepPersonalDetails;
