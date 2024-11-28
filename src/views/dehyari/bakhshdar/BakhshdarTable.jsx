"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { GetHumanResourcesForBakhshdar } from "@/Services/humanResources";
import { toast } from "react-toastify";
import api from '@/utils/axiosInstance';
import CustomIconButton from "@core/components/mui/IconButton";
import Box from "@mui/material/Box";
import { translateContractState } from "@utils/contractStateTranslator";
import ContractStateChip from "@components/badges/ContractStateChip";
import WorkFlowPopup from "@views/dehyari/form/workflow/WorkFlowPopup";
import WorkFlowDrawer from '../form/workflow/WorkFlowDialog';
import useCustomTable from '@/hooks/useCustomTable';

function BakhshdarTable(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const [popupOpen, setPopupOpen] = useState(false);


    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchData = async () => {
        try {
            const response = await api.get(`${GetHumanResourcesForBakhshdar()}`, { requiresAuth: true });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) {
            fetchData();
        }
    }, [loading]);

    const tableData = useMemo(() => data, [data]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'full_name',
                header: 'نام و نام خانوادگی',
                size: 150,
                Cell: ({ row }) => {
                    const { first_name, last_name } = row.original;
                    return <div className={'flex items-center gap-2'}>
                        <img className={'rounded-full h-7'} src="/images/avatars/1.png" alt="پروفایل" />
                        {`${first_name ?? " "} ${last_name ?? " "}`}
                    </div>;
                },
            },
            {
                accessorKey: 'village',
                header: 'دهیاری',
                size: 150,
                Cell: ({ cell }) => <div style={{ textAlign: 'right' }}>{cell.getValue().approved_name}</div>,
            },
            {
                accessorKey: 'nid',
                header: 'کدملی',
                size: 150,
                Cell: ({ cell }) => <div style={{ textAlign: 'right' }}>{cell.getValue()}</div>,
            },
            {
                accessorKey: 'contract_state',
                header: 'وضعیت قرارداد',
                size: 150,
                Cell: ({ cell, row }) => {
                    const contractStateValue = translateContractState(cell.getValue());
                    const role = row.original.contract_type;
                    return <div style={{ textAlign: 'right' }}>
                        <ContractStateChip
                            label={contractStateValue}
                            onClick={() => {
                                if (cell.getValue() == 'pending_supervisor' || cell.getValue() == 'rejected_to_supervisor') {
                                    setSelectedRow(row.original);
                                    setPopupOpen(true);
                                } else {
                                    toast.warning('شما به این قرارداد دسترسی ندارید');
                                }
                            }}
                            avatar={role}
                        />
                    </div>
                },
            },
            {
                accessorKey: 'actions',
                header: 'عملیات',
                size: 150,
                Cell: ({ row }) => (
                    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', height: '100%' }}>
                        {/*<CustomIconButton*/}
                        {/*    color={"error"}*/}
                        {/*    onClick={() => {*/}
                        {/*        handleDeleteTimeOff(row);*/}
                        {/*    }}*/}
                        {/*    className={"rounded-full"}*/}
                        {/*>*/}
                        {/*    <i className='ri-delete-bin-7-line'/>*/}
                        {/*</CustomIconButton>*/}
                        <CustomIconButton
                            color={"secondary"}
                            onClick={() => {
                                router.push(`/dehyari/form?mode=edit&id=${row.original.human_resource_id}`);
                            }}
                            className={"rounded-full"}
                        >
                            <i className='ri-eye-line' />
                        </CustomIconButton>
                    </div>
                ),
            },
        ],
        [anchorEl, selectedRow]
    );

    const table = useCustomTable(columns, tableData, {
        isLoading: loading,

        // تنظیمات اختصاصی این جدول
        enableRowSelection: true,
    });

    return (
        <div>
            <MaterialReactTable table={table} />
            <WorkFlowDrawer open={popupOpen} setDialogOpen={setPopupOpen} details={selectedRow} rejectApprovalLevel={1} setLoading={setLoading} nextState={'pending_governor'} />
        </div>
    );
}

export default BakhshdarTable;
