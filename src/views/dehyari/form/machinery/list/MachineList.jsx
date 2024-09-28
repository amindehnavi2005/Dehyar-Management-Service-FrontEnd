import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import api from '@/utils/axiosInstance';
import { getMachineInformation } from '@/Services/Machine';

const MachineList = ({ handleOpenModal, setData, setMode, methods, loading, setLoading }) => {
    const [machines, setMachines] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const open = Boolean(anchorEl);

    console.log("Loading => ", loading);


    const fetchMachine = async () => {
        console.log("Start Fetch...");
        setLoading(true);
        await api.get(getMachineInformation(), { requiresAuth: true })
            .then((response) => {
                setMachines(response.data.data)
                console.log("Machines => ", response.data);
                setLoading(false);
            })
    }

    useEffect(() => {
        loading ? fetchMachine() : null;
    }, [loading]);

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAddMachine = () => {
        setMode('add');
        handleOpenModal()
    }

    const handleEditMachine = (row) => {
        setMode('edit');
        // methods.setValue(row.original.nid);
        Object.entries(row.original).forEach(([key, value]) => {
            methods.setValue(key, value);
        });
        console.log("Methods =>", methods);
        setData(row.original);
        handleOpenModal()
    }

    const handleDeleteMachine = (row) => {
        const newData = machines.filter((user) => {
            return user.id !== row.original.id
        });
        setMachines(newData);
        setAnchorEl(null);
    }

    const tableData = useMemo(() => machines, [machines]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'شناسه',
                size: 150,
                Cell: ({ cell }) => <div style={{ textAlign: 'right' }}>{cell.getValue()}</div>,
            },
            {
                accessorKey: 'category',
                header: 'دسته بندی',
                size: 150,
                Cell: ({ cell }) => <div style={{ textAlign: 'right' }}>{cell.getValue()}</div>,
            },
            {
                accessorKey: 'machine_type',
                header: 'نوع',
                size: 150,
                Cell: ({ cell }) => <div style={{ textAlign: 'right' }}>{cell.getValue()}</div>
            },
            {
                accessorKey: 'machine_status',
                header: 'وضعیت',
                size: 150,
                Cell: ({ cell }) => <div style={{ textAlign: 'right' }}>{cell.getValue()}</div>
            },
            {
                accessorKey: 'actions',
                header: 'عملیات',
                size: 150,
                Cell: ({ row }) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <IconButton
                        aria-label="more"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, row)}
                        style={{ paddingLeft: 0 }}
                    >
                        <MoreVertIcon style={{ textAlign: "center", justifyContent: 'center', alignItems: 'center' }} />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => {
                            handleEditMachine(selectedRow)
                        }}>
                            ویرایش اطلاعات
                        </MenuItem>
                        <MenuItem onClick={() => {
                            handleDeleteMachine(selectedRow);
                        }}>
                            حذف
                        </MenuItem>
                    </Menu>
                </div>
            },
        ],
        [anchorEl, selectedRow]
    );

    const table = useMaterialReactTable({
        columns,
        data: tableData,
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    fullWidth
                    variant='contained'
                    startIcon={<i className='ri-add-line' />}
                    onClick={handleAddMachine}
                >
                    افزودن ماشین
                </Button>
            </Box>
        ),
        initialState: {
            density: 'compact',
        },
        rowCount: machines.length,
        state: {
            isLoading: loading, // نشان دادن لودینگ پیش‌فرض
            showProgressBars: loading, // نمایش Progress Bars در هنگام بارگذاری
        },  // تنظیم تراکم به صورت پیش‌فرض روی compact
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
        muiPaginationProps: {
            color: 'primary',
            shape: 'rounded',
            showRowsPerPage: true,
            variant: 'outlined',
            sx: {
                button: {
                    borderRadius: '50%', // تبدیل دکمه‌ها به دایره‌ای
                },
            },
        },
        paginationDisplayMode: 'pages',
        muiTableBodyRowProps: () => ({
            style: { height: '10px' } // تنظیم ارتفاع هر سطر با استفاده از استایل‌های inline
        }),
    });

    return (
        <MaterialReactTable table={table} />
    )
}

export default MachineList