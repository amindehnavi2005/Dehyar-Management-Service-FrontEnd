'use client'
import api from '@/utils/axiosInstance';
import { Box, Button, CircularProgress, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';


const UpgradeVillageTable = ({ loading, setLoading, handleAddEventSidebarToggle, addEventSidebarOpen }) => {
    // States
    const [upgradeVillageRanks, setUpgradeVillageRanks] = useState([
        { id: 1, parameter: 'جمعیت', year: 1397, value: 12000, score: 5 },
        { id: 2, parameter: 'وسعت (هکتار)', year: '-', value: 12000, score: 8, isValueEditing: false },
        { id: 3, parameter: 'درآمد (میلیون ریال)', year: 1397, value: 12000, score: 3, isYearEditing: false, isValueEditing: false },
        { id: 4, parameter: 'هدف گردشگری', year: '-', value: false, score: 6 },
        { id: 5, parameter: 'مرکز دهستان', year: '-', value: true, score: 2 },
        { id: 6, parameter: 'مرکز بخش', year: '-', value: false, score: 5 },
    ]);
    const [editedVillageRate, setEditedVillageRate] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [isUpdatingVillageRate, setIsUpdatingVillageRate] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const open = Boolean(anchorEl);

    const fetchVillageRank = async () => {
    }

    useEffect(() => {
        loading ? fetchVillageRank() : null;
    }, [loading]);

    // Handlers
    const handleEditCell = (rowId, key, value) => {
        setUpgradeVillageRanks((prev) =>
            prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
        );
        console.log("Upgrade Village Ranks => ", upgradeVillageRanks);

        setEditedVillageRate((prev) => ({
            ...prev,
            [rowId]: true,
        }));

    };

    // Handlers
    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSidebarToggleSidebar = () => {
        handleAddEventSidebarToggle();
    }

    const handleSaveVillageInformation = () => {
        setIsUpdatingVillageRate(true);
        console.log("Saving changes: ", upgradeVillageRanks);
        toast.success("تغییرات با موفقیت ذخیره شد", {
            position: "top-center",
            duration: 3000
        });
        setIsUpdatingVillageRate(false);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'parameter',
                header: 'پارامتر',
                size: 150,

                Cell: ({ cell }) => {
                    return <div>{cell.getValue()}</div>;
                },
            },
            {
                accessorKey: 'year',
                header: 'سال',
                size: 150,
                Cell: ({ cell, row }) => {
                    const isYearEditing = row.original.isYearEditing;
                    console.log(`Is Editing ${row.original.id} => ${row.original.isYearEditing} Year `);
                    return isYearEditing && (row.original.id === 3) ? (
                        <TextField
                            value={cell.getValue()}
                            onChange={(e) => handleEditCell(row.original.id, 'year', e.target.value)}
                            onBlur={() => handleEditCell(row.original.id, 'isYearEditing', false)}
                            autoFocus
                            inputProps={{
                                style: { height: 1 }
                            }}
                        />
                    ) : (
                        <div onClick={() => {
                            if (row.original.id === 3) {
                                handleEditCell(row.original.id, 'isYearEditing', true);
                            }
                        }}>
                            {cell.getValue()}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'value',
                header: 'مقدار',
                size: 150,
                Cell: ({ cell, row }) => {
                    const isValueEditing = row.original.isValueEditing;
                    console.log(`Is Editing ${row.original.id} => ${row.original.isValueEditing} Value `);
                    return isValueEditing && (row.original.id === 2 || row.original.id === 3) ? (
                        <TextField
                            value={cell.getValue().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            onChange={(e) => handleEditCell(row.original.id, 'value', e.target.value.replace(/,/g, ''))}
                            onBlur={() => handleEditCell(row.original.id, 'isValueEditing', false)}
                            autoFocus
                            inputProps={{
                                style: { height: 1 }
                            }}
                        />
                    ) : (
                        <div onClick={() => {
                            if (row.original.id === 2 || row.original.id === 3) {
                                handleEditCell(row.original.id, 'isValueEditing', true);
                            }
                        }}>
                            {cell.getValue() === true ? (
                                <i className='ri-checkbox-circle-line h-5 text-primary'></i>
                            ) : cell.getValue() === false ? (
                                <i className='ri-close-circle-line h-5'></i>
                            ) : (
                                cell.getValue().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") // جداسازی سه رقم
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'score',
                header: 'امتیاز',
                size: 150,
                Cell: ({ cell }) => <div >{cell.getValue()}</div>,
            },
        ],
        [anchorEl, selectedRow]
    );

    const table = useMaterialReactTable({
        columns,
        data: upgradeVillageRanks,
        enablePagination: false,
        enableTopToolbar: false,
        initialState: {
            density: 'compact',
        },  // تنظیم تراکم به صورت پیش‌فرض روی compact
        muiTableHeadCellProps: {
            style: {
                textAlign: 'center', // وسط‌چین کردن سرستون‌ها
                verticalAlign: 'middle', // عمودی وسط‌چین کردن
                whiteSpace: 'nowrap', // جلوگیری از شکستن متن
                fontWeight: 'bold', // اختیاری: بولد کردن متن سرستون
                padding: '2% 6%'
            },
        },
        muiTableBodyCellProps: {
            style: {
                textAlign: 'center', // وسط‌چین کردن سلول‌های بدنه
                verticalAlign: 'middle', // عمودی وسط‌چین کردن
                whiteSpace: 'nowrap', // جلوگیری از شکستن متن
            },
        },

        rowCount: upgradeVillageRanks.length,
        state: {
            isLoading: loading, // نشان دادن لودینگ پیش‌فرض
            showProgressBars: loading, // نمایش Progress Bars در هنگام بارگذاری
        },
        muiSkeletonProps: {
            animation: 'wave', // تنظیم انیمیشن Skeletons
            height: 28, // ارتفاع Skeletons
        },
        muiLinearProgressProps: {
            color: 'primary', // رنگ Progress Bars
        },
        muiCircularProgressProps: {
            color: 'secondary', // رنگ Circular Progress (در صورت استفاده)
        },
        muiTableBodyRowProps: () => ({
            style: { height: '10px' } // تنظیم ارتفاع هر سطر با استفاده از استایل‌های inline
        }),
        renderBottomToolbarCustomActions: () => {
            const totalScore = upgradeVillageRanks.reduce((accumulator, current) => {
                return accumulator + current.score;
            }, 0);
            return (
                <Box className={`grid grid-cols-4 gap-2 items-center justify-between mt-1 w-full`}>
                    <Button
                        className='col-span-2'
                        color="primary"
                        variant="contained"
                        onClick={handleSaveVillageInformation}
                        disabled={Object.keys(editedVillageRate).length === 0 || Object.values(validationErrors).some((error) => !!error)}
                    >
                        {isUpdatingVillageRate ? <CircularProgress size={25} /> : 'ذخیره و محاسبه'}
                    </Button>
                    {Object.values(validationErrors).some((error) => !!error) && (
                        <Typography color="error">لطفا خطاها را قبل از ارسال اصلاح کنید</Typography>
                    )}
                    <div></div>
                    <Typography textAlign={'center'}>امتیاز<p className='text-primary font-bold'>{totalScore}</p></Typography>
                </Box>
            );
        },
    });

    return (
        <MaterialReactTable table={table} />
    );
}

export default UpgradeVillageTable