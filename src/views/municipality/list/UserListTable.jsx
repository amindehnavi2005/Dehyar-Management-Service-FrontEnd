import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { selectedEvent } from "@/redux-store/slices/calendar";
import Chip from "@mui/material/Chip";
import { me, user } from "@/Services/Auth/AuthService";
import roles from "@data/roles.json";
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from 'react-toastify';
import api from '@/utils/axiosInstance';
import StateCell from './cells/StateCell';
import CityCell from './cells/CityCell';
import RegionCell from './cells/RegionCell';
import CustomIconButton from "@core/components/mui/IconButton";

const UserListTable = ({ dispatch, handleAddEventSidebarToggle, addEventSidebarOpen, setSidebarDetails, loading, setLoading, userGeoState }) => {
    const [users, setUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const open = Boolean(anchorEl);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get(`${user()}?page=${page + 1}&per_page=${perPage}`, { requiresAuth: true });
            const filteredUsers = response.data.data.filter(user =>
                user.geo_state === userGeoState && (user.work_group === 13 || user.work_group === 14)
            );
            setUsers(filteredUsers);
            console.log("Users => ", response.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userGeoState) {
            fetchUsers();
        }
    }, [userGeoState, page, perPage]);

    // Handlers
    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleUserLogin = (row) => {
        toast.warning("این قابلیت به زودی افزوده میشود!");
    };

    const handleEditUser = (row) => {
        console.log("User : ", row);
        setSidebarDetails({ status: 'edit', defaultValues: row.original });
        setAnchorEl(null);
        handleAddEventSidebarToggle();
    };

    const handleChangePassword = (row) => {
        console.log(row);
        toast.warning("این قابلیت به زودی افزوده میشود!");
    };

    const handleDeleteUser = (row) => {
        api.delete(`${user()}/${row.original.id}`, { requiresAuth: true })
            .then(() => {
                toast.success("کاربر با موفقیت حذف شد");
                setLoading(true);
            }).catch((error) => {
            console.error("Error deleting user:", error);
        });
    };

    const handleSidebarToggleSidebar = () => {
        dispatch(selectedEvent(null));
        setSidebarDetails({ status: 'add', defaultValues: {} });
        handleAddEventSidebarToggle();
    };

    const [expandedRows, setExpandedRows] = useState({});

    const handleExpandClick = (rowId) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [rowId]: !prevState[rowId]
        }));
    };

    const getChipColor = (role) => {
        switch (role) {
            case 'مسئول امور مالی':
                return 'primary';
            case 'بخشدار':
                return 'success';
            case 'ناظر فنی':
                return 'warning';
            default:
                return 'default';
        }
    };

    const tableData = useMemo(() => users, [users]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'first_name',
                header: 'نام و نام خانوادگی',
                size: 150,
                Cell: ({ row }) => {
                    const { first_name, last_name } = row.original;
                    return <div style={{ textAlign: 'right' }}>{`${first_name} ${last_name}`}</div>;
                },
            },
            {
                accessorKey: 'nid',
                header: 'کدملی',
                size: 150,
                Cell: ({ cell }) => <div style={{ textAlign: 'right' }}>{cell.getValue()}</div>,
            },
            {
                accessorKey: 'geo_state',
                header: 'استان',
                size: 150,
                Cell: ({ cell }) => <div></div>
            },
            {
                accessorKey: 'geo_city',
                header: 'شهرستان',
                size: 150,
                Cell: ({ cell }) => <div></div>
            },
            {
                accessorKey: 'geo_region',
                header: 'بخش',
                size: 150,
                Cell: ({ cell }) => <div></div>
            },
            {
                accessorKey: 'work_group',
                header: 'نقش',
                size: 150,
                Cell: ({ cell }) => {
                    const role = cell.getValue();
                    return (
                        <div style={{ textAlign: 'right' }}>
                            <Chip sx={{ height: 27.5 }} label={roles[role]} color={getChipColor(roles[role])} />
                        </div>
                    );
                },
            },
            {
                accessorKey: 'covered_villages',
                header: 'تعداد دهیاری‌ها',
                size: 150,
                Cell: ({ cell, row }) => {
                    const dehyaries = cell.getValue();
                    const rowId = row.id;
                    return (
                        <div style={{ textAlign: 'right' }}>
                            {dehyaries.length === 0 ? '-' : `${dehyaries.length} روستا`}
                        </div>
                    );
                }
            },
            {
                accessorKey: 'actions',
                header: 'عملیات',
                size: 150,
                Cell: ({ row }) => (
                    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%' }}>
                        <CustomIconButton
                            color={"error"}
                            onClick={() => {
                                handleDeleteUser(row);
                            }}
                            className={"rounded-full"}
                        >
                            <i className='ri-delete-bin-7-line' />
                        </CustomIconButton>
                        <CustomIconButton
                            color={"primary"}
                            onClick={() => {
                                handleEditUser(row);
                            }}
                            className={"rounded-full"}
                        >
                            <i className='ri-edit-box-line' />
                        </CustomIconButton>
                    </div>
                )
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
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    fullWidth
                    variant='contained'
                    onClick={handleSidebarToggleSidebar}
                    startIcon={<i className='ri-add-line' />}
                >
                    افزودن کاربر
                </Button>
            </Box>
        ),
        initialState: {
            density: 'compact',
            pagination: {
                pageIndex: page,
                pageSize: perPage,
            }
        },
        rowCount: users.length,
        state: {
            isLoading: loading,
            showProgressBars: loading,
        },
        muiSkeletonProps: {
            animation: 'wave',
            height: 28,
        },
        muiLinearProgressProps: {
            color: 'primary',
        },
        muiCircularProgressProps: {
            color: 'secondary',
        },
        muiPaginationProps: {
            color: 'primary',
            shape: 'rounded',
            showRowsPerPage: true,
            variant: 'outlined',
            sx: {
                button: {
                    borderRadius: '50%',
                },
            },
        },
        paginationDisplayMode: 'pages',
        muiTableBodyCellProps: {
            className: 'bg-backgroundPaper',
            sx: {
                padding: '2px 8px',
                lineHeight: '1',
            },
        }
    });

    return (
        <MaterialReactTable table={table} />
    );
}

export default UserListTable;