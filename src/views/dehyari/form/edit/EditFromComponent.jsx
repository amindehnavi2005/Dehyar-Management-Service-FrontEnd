"use client"
import React, { useEffect, useState } from 'react';
import { Grid, Card } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import EditButtonGroup from './EditButtonGroup';
import EditFormContent from './EditFormContent';
import EditProfilePictureUpload from "@views/dehyari/form/edit/EditProfilePictureUpload";
import validationSchemas from "@views/dehyari/form/validationSchemas";
import EditTableComponent from "@views/dehyari/form/edit/Tables/EditTableComponent";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { humanResources } from "@/Services/humanResources";
import EditHumanResourceFormDTO from "@utils/EditHumanResourceFormDTO";
import {toast} from "react-toastify";

function EditFromComponent() {
    const [defaultValue, setDefaultValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const queryParams = new URLSearchParams(window.location.search);
    const param = queryParams.get('param');

    const methods = useForm({
        defaultValues: {},
    });

    useEffect(() => {
        const fetchHumanResourceData = async () => {
            const token = window.localStorage.getItem('token');

            if (param) {
                setLoading(true);
                setError(false);
                try {
                    const response = await axios.get(`${humanResources()}/findByIdOrNid/${param}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const dto = new EditHumanResourceFormDTO(response.data);
                    setDefaultValue(dto);
                    methods.reset(dto);
                } catch (error) {
                    console.error('Error fetching human resource data:', error);
                    setError(true);
                    if (error.response) {
                        toast.error(`خطا در دریافت اطلاعات: ${error.response.status}`);
                    } else {
                        toast.error("خطا در ارتباط با سرور");
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchHumanResourceData();
    }, [param, methods]);


    const [showTable, setShowTable] = useState(false);

    const onSubmit = async (formData) => {
        const apiData = EditHumanResourceFormDTO.fromForm(formData);
        try {
            const response = await axios.put(`${humanResources()}/update/${formData.id}`, apiData, {
                headers: { Authorization: `Bearer ${window.localStorage.getItem('token')}` }
            });
            toast.success('اطلاعات با موفقیت ذخیره شد');
        } catch (error) {
            console.error('Error updating human resource:', error);
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => {
                    toast.error(err);
                });
            } else {
                toast.error('خطا در به‌روزرسانی اطلاعات');
            }
        }
    };


    const handleSwitch = () => setShowTable(!showTable);

    if (loading) return <div>در حال بارگذاری...</div>;
    if (error) return <div>خطا در بارگذاری داده‌ها. لطفا دوباره تلاش کنید.</div>;

    return (
        <Grid container spacing={6}>
            <FormProvider {...methods}>
                <Grid item xs={12} md={9}>
                    <Card>
                        <AnimatePresence mode="wait">
                            {showTable ? (
                                <motion.div key="table" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                                    <EditTableComponent />
                                </motion.div>
                            ) : (
                                <motion.div key="form" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                                    <EditFormContent validationSchemas={validationSchemas} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <EditProfilePictureUpload defaultProfilePicture={defaultValue?.profilePicture} />
                        </Grid>
                        <Grid item xs={12}>
                            <EditButtonGroup onSubmit={methods.handleSubmit(onSubmit)} onSwitch={handleSwitch} showTable={showTable} />
                        </Grid>
                    </Grid>
                </Grid>
            </FormProvider>
        </Grid>
    );
}

export default EditFromComponent;
