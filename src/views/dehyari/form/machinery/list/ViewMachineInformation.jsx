import DividerSimple from '@/components/common/Divider/DividerSimple'
import { getMachineBasicInformation } from '@/Services/Machine'
import api from '@/utils/axiosInstance'
import { MachineInformationDTO } from '@/utils/MachineInformationDTO'
import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const ViewMachineInformation = ({ onClose, data }) => {

    const machineDTO = new MachineInformationDTO(data);
    console.log("Macine DTO => ", machineDTO);

    const [basicInformation, setBasicInformation] = useState({});
    const [currentPage, setCurrentPage] = useState(0);

    const fetchMachineBasicInformation = async () => {
        await api.get(getMachineBasicInformation(), { requiresAuth: true })
            .then((response) => {
                console.log("Method Machine Basic  => ", data);
                const newResponse = response.data.data.filter((item) => {
                    console.log("Item => ", item);

                    return item.id == data.machine_basic_id
                })
                console.log("New Response => ", newResponse);
                setBasicInformation(newResponse);
                console.log("Basic Information => ", basicInformation);
                console.log(response.data);
                console.log("Response => ", response.data.data);
            })
    }

    useEffect(() => {
        fetchMachineBasicInformation();
    }, []);

    const renderTypographyIcon = (icon, label, name) => (
        <Box display={'flex'} gap={2} alignItems={'center'}>
            <i className={`${icon} text-base`}></i>
            <Typography><span className='font-medium text-black'>{label} :</span> {name}</Typography>
        </Box>
    );

    return (
        <Grid container spacing={2} mt={1}>
            <div className='flex bg-backgroundDefault w-full items-center p-5 rounded-xl border-2 mb-5 justify-between'>
                <Typography>{basicInformation && basicInformation.length ? `${basicInformation[0].category} - ${basicInformation[0].type} - ${basicInformation[0].title}` : ''}</Typography>
                <div className='flex justify-between bg-backgroundPaper   rounded-full'>
                    <Button className='rounded-full' variant={currentPage == 0 && "contained"} onClick={() => { setCurrentPage(0) }}>اطلاعات خودرو</Button>
                    <Button className='rounded-full' variant={currentPage == 1 && "contained"} onClick={() => { setCurrentPage(1) }}>تاریخچه وضعیت</Button>
                </div>
            </div>
            <Grid item xs={12} mb={5}>
                <DividerSimple title={'اطلاعات پایه'} />
                <div className='grid md:grid-cols-3 w-full gap-8 mt-8'>
                    {renderTypographyIcon('ri-settings-5-line', 'سیستم', machineDTO.system)}
                    {renderTypographyIcon('ri-hashtag', 'شماره موتور', machineDTO.engineNumber)}
                    {renderTypographyIcon('ri-calendar-event-line', 'سال ساخت', machineDTO.manufacturingYear)}
                    {renderTypographyIcon('ri-hashtag', 'شماره شاسی', machineDTO.chassisNumber)}
                    {renderTypographyIcon('ri-hashtag', 'تعداد سیلندر', machineDTO.numberCylinders)}
                    {renderTypographyIcon('ri-group-line', 'ظرفیت (نفر)', machineDTO.capacity)}
                    {renderTypographyIcon('ri-hashtag', 'تعداد محور', machineDTO.numberAxles)}
                    {renderTypographyIcon('ri-font-color', 'رنگ', machineDTO.color)}
                    {renderTypographyIcon('ri-exchange-line', 'سوخت', machineDTO.fuel)}
                </div>
            </Grid>
            <Grid item xs={12} mb={5}>
                <DividerSimple title={'بهای تمام شده'} />
                {machineDTO.machineCostFields.map((machineCostField) => (
                    console.log("Machine => ", machineCostField),
                    <div className='grid md:grid-cols-3 w-full gap-8 mt-8'>
                        {renderTypographyIcon('ri-bank-line', 'محل تامین مالی', machineCostField.funding_source)}
                        {renderTypographyIcon('ri-cash-line', 'هزینه (میلیون ریال)', machineCostField.amount)}
                        {renderTypographyIcon('ri-message-line', 'توضیحات', machineCostField.description)}
                    </div>
                ))}
            </Grid>
        </Grid>
    )
}

export default ViewMachineInformation