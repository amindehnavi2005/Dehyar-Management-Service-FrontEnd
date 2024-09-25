import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import { React, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const persianToEnglishDigits = (str) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const englishDigits = "0123456789";
    return str.replace(/[۰-۹]/g, (char) => englishDigits[persianDigits.indexOf(char)]);
};

const PlateCreator = ({ setData }) => {
    const { control, handleSubmit, formState: { errors } } = useFormContext();

    const [firstTwoDigits, setFirstTwoDigits] = useState('');
    const [selectedLetter, setSelectedLetter] = useState('');
    const [lastThreeDigits, setLastThreeDigits] = useState('');
    const [countryCode, setCountryCode] = useState('');

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

    return (
        <>
            <div class="flex h-[45px] bg-backgroundPaper border-[1px] text-xl text-black font-bold rounded-md  relative ">
                <div class="flex justify-around items-center w-full text-center">
                    {renderTextField("first_code_plate", 2)}
                    {renderTextField("second_code_plate", 3)}
                    <span>ش</span>
                    {renderTextField("last_code_plate", 2)}
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