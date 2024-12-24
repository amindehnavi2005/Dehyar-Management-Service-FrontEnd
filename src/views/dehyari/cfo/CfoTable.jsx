"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Chip from "@mui/material/Chip";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { GetHumanResourcesForCfo } from "@/Services/humanResources";
import contractType from "@data/contractType.json";
import PersonalOption from "@data/PersonalOption.json";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import { toast } from "react-toastify";
import { getJobTitleLabel } from "@data/jobTitles";
import api from "@/utils/axiosInstance";
import Loading from "@/@core/components/loading/Loading";
import CustomIconButton from "@core/components/mui/IconButton";
import Typography from "@mui/material/Typography";
import { translateContractState } from "@utils/contractStateTranslator";
import ContractStateChip from "@components/badges/ContractStateChip";
import WorkFlowDrawer from "../form/workflow/WorkFlowDialog";
import useCustomTable from "@/hooks/useCustomTable";
import FilterChip from "@/@core/components/mui/FilterButton";
import HistoryWorkflowPopup from "../form/workflow/HistoryWorkflow";
import { downloadHumanResourcePdf } from "@/utils/humanResourcePdfUtils";
import MyDocument from "@components/MyDocument";
import { pdf } from "@react-pdf/renderer";
import TitleDehyariPanel from "@/components/common/TitleDehyariPanel";
import accessControl from "@/components/layout/vertical/accessControl";
import WORK_GROUPS from "@/components/layout/vertical/workGroups";

function CfoTable(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupWorkflow, setPopupWorkflow] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({ width: 0, left: 0 });
  const [filterStatus, setFilterStatus] = useState("my_inbox");
  const buttonRefs = useRef([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [myInboxCount, setMyInboxCount] = useState(0);

  useEffect(() => {
    const count = data.filter(
      (item) =>
        item.contract_state === "draft" ||
        item.contract_state === "rejected_to_financial_officer"
    ).length;
    setMyInboxCount(count);

    accessControl[WORK_GROUPS.CFO] = accessControl[WORK_GROUPS.CFO].map(
      (item) => {
        if (item.badge !== undefined) {
          return { ...item, badge: count };
        }
        return item;
      }
    );
  }, [data]);

  useEffect(() => {
    // Set initial highlight on the "همه" button
    if (buttonRefs.current[0]) {
      const { offsetWidth, offsetLeft } = buttonRefs.current[0];
      setHighlightStyle({ width: offsetWidth, right: offsetLeft });
    }
  }, []);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row.original);
  };

  const handleDownloadPdf = async (row) => {
    downloadHumanResourcePdf(row.human_resource_id, row.human_contract_id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleFilterChange = (status, index) => {
    setFilterStatus(status);
    const button = buttonRefs.current[index];
    if (button) {
      const { offsetWidth, offsetLeft } = button;
      setHighlightStyle({ width: offsetWidth, right: offsetLeft });
    }
  };

  const handleWorkflowHistory = (row) => {
    if (row?.salary_id) {
      setCurrentRow(row); // مقداردهی صحیح به currentRow
      setPopupWorkflow(true); // باز کردن پنجره تاریخچه
    } else {
      toast.error("اطلاعات تاریخچه موجود نیست.");
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`${GetHumanResourcesForCfo()}`, {
        requiresAuth: true,
      });
      setData(response.data);
      setLoading(false);
      setTableLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, [loading]);

  const tableData = useMemo(() => {
    if (!filterStatus) {
      return data;
    }
    if (filterStatus === "my_inbox") {
      return data.filter(
        (item) =>
          item.contract_state === "draft" ||
          item.contract_state === "rejected_to_financial_officer"
      );
    }
    return data.filter((item) => item.contract_state === filterStatus);
  }, [data, filterStatus]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "first_name",
        header: "نام و نام خانوادگی",
        size: 150,
        Cell: ({ row }) => {
          const { first_name, last_name } = row.original;
          return (
            <div className={"flex items-center gap-2"}>
              <img
                className={"rounded-full h-7"}
                src="/images/avatars/1.png"
                alt="پروفایل"
              />
              {`${first_name ?? " "} ${last_name ?? " "}`}
            </div>
          );
        },
      },
      {
        accessorKey: "village",
        header: "دهیاری",
        size: 150,
        Cell: ({ cell }) => {
          return (
            <div style={{ textAlign: "right" }}>
              {(cell.getValue() && cell.getValue().approved_name) || "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "job_type",
        header: "پست سازمانی",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>{cell.getValue()}</div>
        ),
      },
      {
        accessorKey: "nid",
        header: "کدملی",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>{cell.getValue()}</div>
        ),
      },
      {
        accessorKey: "contract_state",
        header: "وضعیت قرارداد",
        size: 150,
        Cell: ({ cell, row }) => {
          const contractStateValue = translateContractState(cell.getValue());
          const role = row.original.contract_type;
          return (
            <div style={{ textAlign: "right" }}>
              <ContractStateChip
                label={contractStateValue.title}
                color={contractStateValue.color}
                avatar={role}
              />
            </div>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "عملیات",
        size: 150,
        Cell: ({ row }) => (
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Tooltip title={"ویرایش اطلاعات"}>
              <CustomIconButton
                color={"secondary"}
                onClick={() => {
                  router.push(
                    `/dehyari/form/edit?param=${row.original.nid}&id=${row.original.human_resource_id}&salary_id=${row.original.salary_id}`
                  );
                }}
                className={"rounded-full"}
              >
                <i className="ri-edit-box-line" />
              </CustomIconButton>
            </Tooltip>
            <Tooltip title={"دانلود PDF"}>
              <CustomIconButton
                color={"secondary"}
                onClick={() => {
                  handleDownloadPdf(row.original);
                }}
                className={"rounded-full"}
              >
                <i className="ri-printer-line" />
              </CustomIconButton>
            </Tooltip>
            {/* <CustomIconButton
                            color={"secondary"}
                            onClick={() => {
                                handleWorkflowHistory(row.original);
                            }}
                            className={"rounded-full"}
                        >
                            < i class="ri-history-line" />
                        </CustomIconButton> */}
            {row.original.contract_state && (
              <Tooltip title={"مشاهده/تغییر وضعیت قرارداد"}>
                <CustomIconButton
                  color={"secondary"}
                  onClick={() => {
                    setCurrentRow(row.original);
                    setPopupOpen(true);
                  }}
                  className={"rounded-full animate-pulse"}
                >
                  {row.original.contract_state == "draft" ||
                  row.original.contract_state ==
                    "rejected_to_financial_officer" ? (
                    <i className="ri-mail-send-line" />
                  ) : (
                    <i className="ri-history-line" />
                  )}
                </CustomIconButton>
              </Tooltip>
            )}
          </div>
        ),
      },
    ],
    [currentRow]
  );

  const table = useCustomTable(columns, tableData, {
    isLoading: tableLoading,
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: 1, position: "relative" }}>
        <Button
          variant="contained"
          onClick={() => router.push("/dehyari/form")}
          className={"rounded-full h-8"}
        >
          <i className="ri-add-line" />
        </Button>
        <Box
          className={"bg-backgroundPaper rounded-full"}
          sx={{
            position: "absolute",
            height: "90%",
            transition: "width 0.3s, right 0.3s",
            ...highlightStyle,
          }}
        />
        <FilterChip
          avatarValue={data.length.toString()}
          ref={(el) => (buttonRefs.current[0] = el)}
          label="همه"
          onClick={() => handleFilterChange("", 0)}
          clickable
          variant={filterStatus === "" ? "outlined" : "filled"}
        />
        <FilterChip
          avatarValue={data
            .filter(
              (item) =>
                item.contract_state === "draft" ||
                item.contract_state === "rejected_to_financial_officer"
            )
            .length.toString()}
          ref={(el) => (buttonRefs.current[1] = el)}
          label="کارتابل من"
          onClick={() => handleFilterChange("my_inbox", 1)}
          clickable
          variant={filterStatus === "my_inbox" ? "outlined" : "filled"}
        />
        <FilterChip
          avatarValue={data
            .filter((item) => item.contract_state === "approved")
            .length.toString()}
          ref={(el) => (buttonRefs.current[2] = el)}
          label="تایید شده"
          onClick={() => handleFilterChange("approved", 2)}
          clickable
          variant={filterStatus === "approved" ? "outlined" : "filled"}
        />
      </Box>
    ),
  });

  return (
    <div>
      <TitleDehyariPanel />
      <MaterialReactTable table={table} />
      <WorkFlowDrawer
        open={popupOpen}
        setDialogOpen={setPopupOpen}
        details={currentRow}
        rejectApprovalLevel={0}
        loading={loading}
        setLoading={setLoading}
        nextState={"pending_supervisor"}
        readOnly={
          !(
            currentRow?.contract_state == "draft" ||
            currentRow?.contract_state == "rejected_to_financial_officer"
          )
        }
      />
    </div>
  );
}

export default CfoTable;
