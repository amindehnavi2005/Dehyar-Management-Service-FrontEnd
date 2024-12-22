"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import CustomIconButton from "@core/components/mui/IconButton";
import useCustomTable from "@/hooks/useCustomTable";
import { getVillageGradeUpgrades } from "@/Services/UpgradeVillage";
import api from "@/utils/axiosInstance";
import FilterChip from "@/@core/components/mui/FilterButton";
import ContractStateChip from "@/components/badges/ContractStateChip";
import { translateContractState } from "@/utils/contractStateTranslator";
import WorkFlowDrawerForUpdateVillageRank from "../../form/workflow/WorkFlowDrawerForUpgradeVillageRank";

function GradingVillageForGovernor() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [tableLoading, setTableLoading] = useState(true);
  const [highlightStyle, setHighlightStyle] = useState({ width: 0, left: 0 });
  const [filterStatus, setFilterStatus] = useState("");
  const buttonRefs = useRef([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (buttonRefs.current[0]) {
      const { offsetWidth, offsetLeft } = buttonRefs.current[0];
      setHighlightStyle({ width: offsetWidth, right: offsetLeft });
    }
  }, []);

  const handleFilterChange = (status, index) => {
    setFilterStatus(status);
    const button = buttonRefs.current[index];
    if (button) {
      const { offsetWidth, offsetLeft } = button;
      setHighlightStyle({ width: offsetWidth, right: offsetLeft });
    }
  };

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row.original);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`${getVillageGradeUpgrades()}`, {
        requiresAuth: true,
      });
      setData(response.data.data);
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
    return (
      data.length && data.filter((item) => item.contract_state === filterStatus)
    );
  }, [data, filterStatus]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "geo_city",
        header: "شهرستان",
        size: 150,
        Cell: ({ cell }) => {
          return (
            <div style={{ textAlign: "right" }}>{cell.getValue() || "-"}</div>
          );
        },
      },
      {
        accessorKey: "geo_region",
        header: "بخش",
        size: 150,
        Cell: ({ cell }) => {
          return (
            <div style={{ textAlign: "right" }}>{cell.getValue() || "-"}</div>
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
        accessorKey: "state",
        header: "وضعیت",
        size: 150,
        Cell: ({ cell, row }) => {
          const contractStateValue = translateContractState(cell.getValue());
          return (
            <div style={{ textAlign: "right" }}>
              <ContractStateChip
                label={contractStateValue.title}
                color={contractStateValue.color}
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
            {row.original.state && (
              <Tooltip title={"مشاهده/تغییر وضعیت درجه بندی"}>
                <CustomIconButton
                  color={"secondary"}
                  onClick={() => {
                    setCurrentRow(row.original);
                    setDialogOpen(true);
                  }}
                  className={"rounded-full animate-pulse"}
                >
                  {row.original.state == "pending_governor" ||
                  row.original.state == "rejected_to_governor" ? (
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
          avatarValue={data?.length?.toString() || 0}
          ref={(el) => (buttonRefs.current[0] = el)}
          label="همه"
          onClick={() => handleFilterChange("", 0)}
          clickable
          variant={filterStatus === "" ? "outlined" : "filled"}
        />
        <FilterChip
          avatarValue={
            (data.length &&
              data
                .filter(
                  (item) =>
                    item.contract_state === "draft" ||
                    item.contract_state === "rejected_to_financial_officer"
                )
                .length.toString()) ||
            0
          }
          ref={(el) => (buttonRefs.current[1] = el)}
          label="کارتابل من"
          onClick={() => handleFilterChange("my_inbox", 1)}
          clickable
          variant={filterStatus === "my_inbox" ? "outlined" : "filled"}
        />
        <FilterChip
          avatarValue={
            (data.length &&
              data
                .filter((item) => item.contract_state === "approved")
                .length.toString()) ||
            0
          }
          ref={(el) => (buttonRefs.current[2] = el)}
          label="تایید شده"
          onClick={() => handleFilterChange("approved", 2)}
          clickable
          variant={filterStatus === "approved" ? "outlined" : "filled"}
        />
        <FilterChip
          avatarValue={
            (data.length &&
              data
                .filter((item) => item.contract_state === "rejected")
                .length.toString()) ||
            0
          }
          ref={(el) => (buttonRefs.current[3] = el)}
          label="رد شده"
          onClick={() => handleFilterChange("rejected", 3)}
          clickable
          variant={filterStatus === "rejected" ? "outlined" : "filled"}
        />
        <FilterChip
          avatarValue={
            (data.length &&
              data
                .filter((item) => item.contract_state === "rejected")
                .length.toString()) ||
            0
          }
          ref={(el) => (buttonRefs.current[4] = el)}
          label="نیازمند اصلاح"
          onClick={() => handleFilterChange("rejected", 4)}
          clickable
          variant={filterStatus === "rejected" ? "outlined" : "filled"}
        />
      </Box>
    ),
  });

  return (
    <div>
      <Typography display={"flex"} variant={"h5"} mb={5} gap={1}>
        <span>درخواست</span>
        <span className={"text-error font-bold relative inline-block"}>
          درجه بندی
          <img
            src="/images/icons/Line-2.png"
            alt="زیرخط"
            style={{
              display: "block",
              margin: "0 auto",
              width: "100%",
              height: "4px",
              position: "absolute",
              bottom: "-2px",
              objectFit: "contain",
            }}
          />
        </span>
        دهیاری ها
      </Typography>
      <MaterialReactTable table={table} />
      <WorkFlowDrawerForUpdateVillageRank
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        details={currentRow}
        rejectApprovalLevel={0}
        loading={loading}
        setLoading={setLoading}
        nextState={"pending_governor"}
        readOnly={
          !(
            currentRow?.state == "pending_governor" ||
            currentRow?.state == "rejected_to_governor"
          )
        }
      />
    </div>
  );
}

export default GradingVillageForGovernor;
