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
import useCustomTable from "@/hooks/useCustomTable";
import FilterChip from "@/@core/components/mui/FilterButton";
import TitleDehyariPanel from "@/components/common/TitleDehyariPanel";

function GradingVillage(props) {
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

  useEffect(() => {
    if (buttonRefs.current[0]) {
      const { offsetWidth, offsetLeft } = buttonRefs.current[0];
      setHighlightStyle({ width: offsetWidth, right: offsetLeft });
    }
  }, []);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row.original);
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
        accessorKey: "geo_city",
        header: "شهرستان",
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
        accessorKey: "geo_region",
        header: "شهرستان",
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
        accessorKey: "previous_degree",
        header: "درجه قبلی",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>{cell.getValue()}</div>
        ),
      },
      {
        accessorKey: "date",
        header: "تاریخ",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>{cell.getValue()}</div>
        ),
      },
      {
        accessorKey: "final_degree",
        header: "درجه نهایی",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>{cell.getValue()}</div>
        ),
      },
      {
        accessorKey: "request_date",
        header: "تاریخ درخواست",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>{cell.getValue()}</div>
        ),
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
            <Tooltip title={"درجه بندی"}>
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
          onClick={() => router.push("/dehyari/dehyar/upgrade-village-rank")}
          className={"rounded-full h-8"}
        >
          <i className="ri-add-line" />
        </Button>
      </Box>
    ),
  });

  return (
    <div>
      <TitleDehyariPanel />
      <MaterialReactTable table={table} />
      {/* <WorkFlowDrawer
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
      /> */}
    </div>
  );
}

export default GradingVillage;
