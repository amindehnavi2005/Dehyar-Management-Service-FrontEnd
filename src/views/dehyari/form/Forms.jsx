'use client'

import {FormProvider, useForm} from 'react-hook-form'
import {Button, Card, CardContent, Grid} from '@mui/material'
import StepJobDetails from './StepJobDetails'
import StepPersonalDetails from './StepPersonalDetails'
import StepEducation from './StepEducation'
import StepInsurance from './StepInsurance'
import StepChildren from './StepChildren'
import StepContract from './StepContract'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SaveIcon from '@mui/icons-material/Save'
import validationSchemas from './validationSchemas'
import axios from "axios";
import {humanResources} from "@/Services/humanResources";
import MyDocument from "@components/MyDocument";
import {pdf} from "@react-pdf/renderer";
import {salaryToDTO} from "@/utils/SalaryDTO";
import {toast} from "react-toastify";

const Forms = ({invoiceData}) => {
    const methods = useForm({
        defaultValues: {
            jobTitle: '',
            nationalCode: '',
            coveredVillages: '',
            fullName: '',
            fatherName: '',
            personalId: '',
            gender: '',
            maritalStatus: '',
            birthPlace: '',
            issuancePlace: '',
            veteranStatus: '',
            militaryService: '',
            educations: [{degree: '', fieldOfStudy: '', graduationDate: ''}],
            insurances: [{
                workplace: '',
                contract_type :"",
                insurancePeriod: '',
                insuranceType: '',
                employmentStartDate: '',
                employmentEndDate: ''
            }],
            children: [{
                nationalCode: '',
                fullName: '',
                gender: '',
                birthDate: '',
                marriageDate: '',
                endOfStudyExemption: '',
                deathDate: ''
            }],
            contractType: '',
            employmentStatus: '',
            contractStart: '',
            contractEnd: '',
            execute_start: '',
            descriptionContract: '',
            titleContract: ''
        }
    })

    const onSubmit = data => {
        data = methods.getValues();
        const formattedData = salaryToDTO(data);
        console.log(formattedData);
        axios.post(humanResources(), formattedData, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`,
            },
        }).then((res) => {
            const { human_resource, children, educations, insurances } = res.data;

            if (human_resource) {
                toast.success("Human resource با موفقیت ایجاد شد", {
                    position: "top-center"
                });
            } else {
                toast.error("خطا در ایجاد Human resource", {
                    position: "top-center"
                });
            }

            children.forEach((status, index) => {
                if (status) {
                    toast.success(`Child ${index + 1} با موفقیت ایجاد شد`, {
                        position: "top-center"
                    });
                } else {
                    toast.error(`خطا در ایجاد Child ${index + 1}`, {
                        position: "top-center"
                    });
                }
            });

            educations.forEach((status, index) => {
                if (status) {
                    toast.success(`Education ${index + 1} با موفقیت ایجاد شد`, {
                        position: "top-center"
                    });
                } else {
                    toast.error(`خطا در ایجاد Education ${index + 1}`, {
                        position: "top-center"
                    });
                }
            });

            insurances.forEach((status, index) => {
                if (status) {
                    toast.success(`Insurance ${index + 1} با موفقیت ایجاد شد`, {
                        position: "top-center"
                    });
                } else {
                    toast.error(`خطا در ایجاد Insurance ${index + 1}`, {
                        position: "top-center"
                    });
                }
            });
        }).catch((error) => {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((key) => {
                    errors[key].forEach((message) => {
                        toast.error(message);
                    });
                });
            } else if (error.response && error.response.data.message) {
                console.log(error.response);
                toast.error(error.response.data.message, {
                    position: "top-center"
                });
            } else {
                toast.error("خطای ناشناخته", {
                    position: "top-center"
                });
            }
        });
    };


    const handleDownload = async () => {
        const doc = <MyDocument/>;
        const asPdf = pdf([]); // Creating an instance of pdf
        asPdf.updateContainer(doc);
        const blob = await asPdf.toBlob();

        const url = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.src = url;

        document.body.appendChild(iframe);

        iframe.onload = () => {
            iframe.contentWindow.print();
        };
    };
    return (
        <>
            <Grid container spacing={6}>
                <FormProvider {...methods}>
                    <Grid item xs={12} md={9}>
                        <Card>
                            <CardContent className='sm:!p-12'>
                                <Grid container spacing={6}>
                                    <StepJobDetails invoiceData={invoiceData}
                                                    validation={validationSchemas.jobDetails}/>
                                    <StepPersonalDetails validation={validationSchemas.personalDetails}/>
                                    <StepEducation validation={validationSchemas.education}/>
                                    <StepInsurance validation={validationSchemas.insurance}/>
                                    <StepChildren validation={validationSchemas.children}/>
                                    <StepContract validation={validationSchemas.contract}/>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Grid container spacing={6}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent className='flex flex-col gap-4'>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            startIcon={<SaveIcon/>}
                                            onClick={methods.handleSubmit(onSubmit)}
                                            style={{
                                                backgroundColor: '#1976d2', // رنگ آبی جذاب
                                                color: 'white',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                borderRadius: '8px',
                                                padding: '10px 20px',
                                                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
                                                marginTop: '20px',
                                            }}
                                        >
                                            ذخیره
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="error"
                                            startIcon={<PictureAsPdfIcon/>}
                                            onClick={handleDownload}
                                        >
                                            حکم کارگزینی
                                        </Button>
                                        <Button
                                            fullWidth
                                            color='secondary'
                                            variant='outlined'
                                            className='capitalize'
                                        >
                                            اطلاعات پرسنلی
                                        </Button>
                                        <Button fullWidth color='secondary' variant='outlined' className='capitalize'>
                                            پروفایل
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Grid>
        </>
    )
}

export default Forms
