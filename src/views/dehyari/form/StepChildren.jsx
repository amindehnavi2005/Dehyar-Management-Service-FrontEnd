import React from 'react';
import {
    Grid, Divider, Card, CardContent, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Accordion, AccordionSummary, AccordionDetails, Button, FormHelperText
} from '@mui/material';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

const StepChildren = ({ validation }) => {
    const { control, watch, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'children'
    });

    return (
        <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
                <Divider className='border-dashed' />
            </Grid>
            <Grid item xs={12}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>اطلاعات فرزندان</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {fields.map((item, index) => (
                            <Card key={item.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={3}>
                                            <Controller
                                                name={`children.${index}.nationalCode`}
                                                control={control}
                                                defaultValue=""
                                                rules={validation.nationalCode}
                                                render={({ field }) => (
                                                    <TextField
                                                        fullWidth
                                                        label="کد ملی"
                                                        {...field}
                                                        error={!!errors?.children?.[index]?.nationalCode}
                                                        helperText={errors?.children?.[index]?.nationalCode && errors.children[index].nationalCode.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Controller
                                                name={`children.${index}.fullName`}
                                                control={control}
                                                defaultValue=""
                                                rules={validation.fullName}
                                                render={({ field }) => (
                                                    <TextField
                                                        fullWidth
                                                        label="نام و نام خانوادگی"
                                                        {...field}
                                                        error={!!errors?.children?.[index]?.fullName}
                                                        helperText={errors?.children?.[index]?.fullName && errors.children[index].fullName.message}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <FormControl fullWidth size="small" error={!!errors?.children?.[index]?.gender}>
                                                <InputLabel>جنسیت</InputLabel>
                                                <Controller
                                                    name={`children.${index}.gender`}
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
                                                            <MenuItem value="male">مرد</MenuItem>
                                                            <MenuItem value="female">زن</MenuItem>
                                                        </Select>
                                                    )}
                                                />
                                                {errors?.children?.[index]?.gender && <FormHelperText>{errors.children[index].gender.message}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Controller
                                                name={`children.${index}.birthDate`}
                                                control={control}
                                                defaultValue=""
                                                rules={validation.birthDate}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        calendar={persian}
                                                        locale={persian_fa}
                                                        calendarPosition="bottom-right"
                                                        render={<TextField size="small" fullWidth label="تاریخ تولد" error={!!errors?.children?.[index]?.birthDate} helperText={errors?.children?.[index]?.birthDate && errors.children[index].birthDate.message} />}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Controller
                                                name={`children.${index}.marriageDate`}
                                                control={control}
                                                defaultValue=""
                                                rules={validation.marriageDate}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        calendar={persian}
                                                        locale={persian_fa}
                                                        calendarPosition="bottom-right"
                                                        render={<TextField size="small" fullWidth label="تاریخ ازدواج" error={!!errors?.children?.[index]?.marriageDate} helperText={errors?.children?.[index]?.marriageDate && errors.children[index].marriageDate.message} />}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Controller
                                                name={`children.${index}.endOfStudyExemption`}
                                                control={control}
                                                defaultValue=""
                                                rules={validation.endOfStudyExemption}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        calendar={persian}
                                                        locale={persian_fa}
                                                        calendarPosition="bottom-right"
                                                        render={<TextField size="small" fullWidth label="پایان معافیت تحصیلی" error={!!errors?.children?.[index]?.endOfStudyExemption} helperText={errors?.children?.[index]?.endOfStudyExemption && errors.children[index].endOfStudyExemption.message} />}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Controller
                                                name={`children.${index}.deathDate`}
                                                control={control}
                                                defaultValue=""
                                                rules={validation.deathDate}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        calendar={persian}
                                                        locale={persian_fa}
                                                        calendarPosition="bottom-right"
                                                        render={<TextField size="small" fullWidth label="تاریخ وفات" error={!!errors?.children?.[index]?.deathDate} helperText={errors?.children?.[index]?.deathDate && errors.children[index].deathDate.message} />}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <IconButton
                                                color="error"
                                                aria-label="delete"
                                                size="large"
                                                onClick={() => remove(index)}
                                            >
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                        <Grid container sx={{ mt: 4.75 }}>
                            <Grid item xs={12} sx={{ px: 0 }}>
                                <Button
                                    size='small'
                                    variant='contained'
                                    startIcon={<ExpandMoreIcon />}
                                    onClick={() => append({ nationalCode: '', fullName: '', gender: '', birthDate: '', marriageDate: '', endOfStudyExemption: '', deathDate: '' })}
                                >
                                    افزودن
                                </Button>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    );
};

export default StepChildren;
