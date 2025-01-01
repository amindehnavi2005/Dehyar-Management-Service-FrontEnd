"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import CustomIconButton from "@core/components/mui/IconButton";
import useCustomTable from "@/hooks/useCustomTable";
import TitleDehyariPanel from "@/components/common/TitleDehyariPanel";
import { getVillageGradeUpgrades } from "@/Services/UpgradeVillage";
import api from "@/utils/axiosInstance";
import WorkFlowDrawer from "../../form/workflow/WorkFlowDialog";
import WorkFlowDrawerForUpdateVillageRank from "../../form/workflow/WorkFlowDrawerForUpgradeVillageRank";
import { translateContractState } from "@/utils/contractStateTranslator";
import ContractStateChip from "@/components/badges/ContractStateChip";
import HistoryArrow from "@/components/badges/HistoryArrow";

function GradingVillage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [tableLoading, setTableLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    return data;
  }, [data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "grade_date",
        header: "تاریخ",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>{cell.getValue()}</div>
        ),
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
        accessorKey: "sum_score",
        header: "مجموع امتیاز",
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
        accessorKey: "grade_history",
        header: "درجه بندی",
        size: 150,
        Cell: ({ row }) => (
          <div className="flex items-center justify-start">
            <HistoryArrow
              prevBadge={row.original.current_grade}
              nextBadge={row.original.new_grade}
              text={"تاریخچه درجه بندی"}
              size={"small"}
            />
          </div>
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
                  {row.original.state == "draft" ||
                  row.original.state == "rejected_to_dehyar" ? (
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
          onClick={() => {
            router.push(`/dehyari/dehyar/upgrade-village-rank`);
          }}
          className={"rounded-full h-8"}
        >
          <i className="ri-add-line" />
        </Button>
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
        nextState={"pending_supervisor"}
        readOnly={
          !(
            currentRow?.state == "draft" ||
            currentRow?.state == "rejected_to_dehyar"
          )
        }
      />
    </div>
  );
}

export default GradingVillage;
