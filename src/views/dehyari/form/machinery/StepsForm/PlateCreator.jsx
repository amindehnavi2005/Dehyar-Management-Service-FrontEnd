import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { React, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

const PlateCreator = ({ setData }) => {
    const { control, handleSubmit, formState: { errors } } = useFormContext();

    const typePlates = [
        { value: 0, label: 'ش' },
        { value: 1, label: 'د' },
        { value: 2, label: 'ع' },
    ]


    const renderTextField = (name, count) => (
        <Controller
            name={name}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    variant="outlined"
                    placeholder={count == 2 ? "--" : "---"}
                    InputProps={
                        {
                            style: { height: 45, width: count == 2 ? 55 : 75 }, inputProps: {
                                maxLength: count == 2 ? 2 : 3,
                                style: { textAlign: 'center', border: 'none', fontWeight: 'bold' }
                            }
                        }
                    }
                    value={value}
                    onChange={(e) => {
                        const value = persianToEnglishDigits(e.target.value);
                        setData(prevValues => ({ ...prevValues, [name]: value }));
                        onChange(value);
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 'none', // حذف حاشیه
                            },
                        },
                    }}
                    error={errors[name]}
                    helperText={errors?.[name]?.message}
                />
            )}
        />
    );

    const renderSelect = (name, option) => (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <Select
                    value={value}
                    onChange={e => {
                        const newValue = e.target.value;
                        setTimeout(() => {
                            setData(prevValues => ({ ...prevValues, [name]: newValue }));
                            onChange(newValue)
                            console.log("Data =>", newValue);
                            console.log("Errors => ", errors[name]);

                        }, 0);
                    }}
                    error={errors[name]}
                    sx={{
                        border: 'none', // حذف حاشیه
                            padding: '10px', // تنظیم padding
                            '& .MuiSelect-select': {
                                padding: '10px', // تنظیم padding داخلی
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none', // حذف حاشیه
                            },
                            '&:before, &:after': {
                                border: 'none', // حذف حاشیه قبل و بعد
                            },
                        height: 45,
                    }}
                >
                    {Object.entries(option.map(({ value, label }) => (
                        <MenuItem key={value} value={value}>{label}</MenuItem>
                    )))}
                </Select>
            )}
        />
    )

    // const renderSelect = (name, option) => (
    //     <Controller
    //         name={name}
    //         control={control}
    //         render={({ field: { value, onChange } }) => (
    //             <Select
    //                 value={value}
    //                 onChange={e => {
    //                     const newValue = e.target.value;
    //                     setTimeout(() => {
    //                         setData(prevValues => ({ ...prevValues, [name]: newValue }));
    //                         onChange(newValue)
    //                         console.log("Data =>", newValue);
    //                     }, 0);
    //                 }}
    //                 error={errors[name]}
    //                 sx={{
    //                     '& .MuiOutlinedInput-root': {
    //                         '& fieldset': {
    //                             border: 'none', // حذف حاشیه
    //                         },
    //                     },
    //                     height: 45,
    //                 }}
    //             >
    //                 {Object.entries(option.map(({ value, label }) => (
    //                     <MenuItem key={value} value={value}>{label}</MenuItem>
    //                 )))}
    //             </Select>
    //         )}
    //     />
    // );

    return (
        <>
            <div class="flex h-[45px] bg-backgroundPaper border-[1px] text-xl text-black font-bold rounded-md  relative ">
                <div class="flex justify-around items-center w-full text-center">
                    {renderTextField("plate_province_code", 2)}
                    <span className="text-gray-300">|</span>
                    {renderTextField("plate_uniqe_identifier", 3)}
                    {renderSelect('plate_category_letter', typePlates)}
                    {renderTextField("plate_registration_number", 2)}
                </div>
                <div className="bg-blue-900 px-2 py-1 text-end rounded-l-sm">
                    <div className="font-medium text-white text-sm">
                        <p>.I.R</p>
                        IRAN
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlateCreator;