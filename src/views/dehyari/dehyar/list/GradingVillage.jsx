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
    return data;
  }, [data]);

  const columns = useMemo(
    () => [
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
        accessorKey: "status",
        header: "وضعیت",
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
            {row.original.current_degree && (
              <Tooltip title={"مشاهده/تغییر وضعیت درجه بندی"}>
                <CustomIconButton
                  color={"secondary"}
                  onClick={() => {
                    setCurrentRow(row.original);
                    setDialogOpen(true);
                  }}
                  className={"rounded-full animate-pulse"}
                >
                  {row.original.current_degree == "draft" ||
                  row.original.current_degree ==
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
      <WorkFlowDrawer
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
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

export default GradingVillage;
