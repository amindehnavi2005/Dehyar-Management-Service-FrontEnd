'use client'
import api from '@/utils/axiosInstance';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';


const UpgradeVillageTable = ({ loading, setLoading, handleAddEventSidebarToggle, addEventSidebarOpen }) => {
    const [upgradeVillageRanks, setUpgradeVillageRanks] = useState([
        { id: 1, parameter: 'جمعیت', year: 1397, value: 12000 },
        { id: 2, parameter: 'وسعت (هکتار)', year: 1397, value: 12000 },
        { id: 3, parameter: 'درآمد (میلیون ریال)', year: 1397, value: 12000 },
        { id: 4, parameter: 'هدف گردشگری', year: 1397, value: 12000 },
        { id: 5, parameter: 'مرکزیت', year: 1397, value: 'دارد' },
    ]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const open = Boolean(anchorEl);

    const fetchVillageRank = async () => {
    }

    useEffect(() => {
        loading ? fetchVillageRank() : null;
    }, [loading]);

    const tableData = useMemo(() => upgradeVillageRanks, [upgradeVillageRanks]); // Memoize table data

    // Handlers
    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditVillageRank = (row) => {
        console.log("User : ", row);
        setAnchorEl(null);
        handleAddEventSidebarToggle();
    }

    const handleDeleteUser = (row) => {
        // api.delete(`${user()}/${row.original.id}`, { requiresAuth: true })
        //     .then(() => {
        //         toast.success("کاربر با موفقیت حذف شد", {
        //             position: "top-center"
        //         });
        //         setLoading(true);
        //     }).catch((error) => error)
        toast.warning("این قابلیت به زودی افزوده میشود!",
            {
                position: "top-center",
                duration: 3000
            }
        );
    }

    const handleSidebarToggleSidebar = () => {
        handleAddEventSidebarToggle();
    }

    const [expandedRows, setExpandedRows] = useState({});

    const handleExpandClick = (rowId) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [rowId]: !prevState[rowId]
        }));
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'parameter',
                header: 'پارامتر',
                size: 150,
                Cell: ({ cell }) => {
                    return <div style={{ textAlign: 'right' }}>{cell.getValue()}</div>;
                },
            },
            {
                accessorKey: 'year',
                header: 'سال',
                size: 150,
                Cell: ({ cell }) => <div style={{ textAlign: 'right' }}>{cell.getValue()}</div>,
            },
            {
                accessorKey: 'value',
                header: 'مقدار',
                size: 150,
                Cell: ({ cell }) => {
                    return (
                        // <StateCell state={state} />
                        <div style={{ textAlign: 'right' }}>{cell.getValue()}</div>
                    );
                }
            },
            // {
            //     accessorKey: 'actions',
            //     header: 'عملیات',
            //     size: 150,
            //     Cell: ({ row }) => <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            //         <IconButton
            //             aria-label="more"
            //             aria-controls={open ? 'long-menu' : undefined}
            //             aria-expanded={open ? 'true' : undefined}
            //             aria-haspopup="true"
            //             onClick={(event) => handleClick(event, row)}
            //             style={{ paddingLeft: 0 }}
            //         >
            //             <MoreVertIcon style={{ textAlign: "center", justifyContent: 'center', alignItems: 'center' }} />
            //         </IconButton>
            //         <Menu
            //             id="long-menu"
            //             MenuListProps={{
            //                 'aria-labelledby': 'long-button',
            //             }}
            //             anchorEl={anchorEl}
            //             open={open}
            //             onClose={handleClose}
            //         >
            //             <MenuItem onClick={() => {
            //                 handleEditVillageRank(selectedRow)
            //             }}>
            //                 ویرایش اطلاعات
            //             </MenuItem>
            //             <MenuItem onClick={() => {
            //                 handleDeleteUser(selectedRow);
            //             }}>
            //                 حذف
            //             </MenuItem>
            //         </Menu>
            //     </div>
            // },
        ],
        [anchorEl, selectedRow]
    );

    const table = useMaterialReactTable({
        columns,
        data: tableData,
        enablePagination: false,
        enableTopToolbar: false,
        initialState: {
            density: 'compact',
        },  // تنظیم تراکم به صورت پیش‌فرض روی compact
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
        paginationDisplayMode: 'pages',
        muiTableBodyRowProps: () => ({
            style: { height: '10px' } // تنظیم ارتفاع هر سطر با استفاده از استایل‌های inline
        }),
    });

    return (
        <MaterialReactTable table={table} />
    );
}

export default UpgradeVillageTable