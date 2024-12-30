"use client";
import api from "@/utils/axiosInstance";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import useCustomTable from "@/hooks/useCustomTable";
import { updateDivisionInformation } from "@/Services/UpgradeVillage";
import { rebuildVillageRanks } from "@/utils/rebuildVillageRank";

const UpgradeVillageTable = ({
  details,
  loading,
  setLoading,
  handleAddEventSidebarToggle,
  addEventSidebarOpen,
}) => {
  const [upgradeVillageRanks, setUpgradeVillageRanks] = useState([]);
  const [editedVillageRate, setEditedVillageRate] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isUpdatingVillageRate, setIsUpdatingVillageRate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);
  const [totalScore, setTotalScore] = useState(0);
  const [newGrade, setNewGrade] = useState(0);

  useEffect(() => {
    if (details) {
      setUpgradeVillageRanks(rebuildVillageRanks(details));
      setTotalScore(details.total_score);
      setNewGrade(details.grade);
    }
  }, [details]);

  const handleEditCell = async (rowId, key, value) => {
    setUpgradeVillageRanks((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
    );

    handleUpgradeVillageRate();
  };

  const handleUpgradeVillageRate = async () => {
    if (upgradeVillageRanks.length < 1) {
      return toast.error("مقداری یافت نشد!");
    } else {
      try {
        setLoading(true);

        const areaHectares = parseInt(
          upgradeVillageRanks.find((row) => row.id === 2)?.value || 0
        );
        const incomePerCapital = parseInt(
          upgradeVillageRanks.find((row) => row.id === 3)?.value || 0
        );

        const response = await api.post(
          updateDivisionInformation(),
          {
            hierarchyCode: details?.hierarchy_code,
            areaHectares: areaHectares,
            incomePerCapital: incomePerCapital,
          },
          {
            requiresAuth: true,
          }
        );

        const updatedData = response.data.data;
        console.log("Updated Data:", updatedData);

        setTotalScore(updatedData.total_score);
        setNewGrade(updatedData.new_grade);

        setUpgradeVillageRanks((prevRanks) =>
          prevRanks.map((row) => {
            switch (row.id) {
              case 1:
                return {
                  ...row,
                  score: updatedData.population_score || row.score,
                };
              case 2:
                return {
                  ...row,
                  value: updatedData.area_hectares || row.value,
                  score: updatedData.area_hectar_score || row.score,
                };
              case 3:
                return {
                  ...row,
                  value: updatedData.income_per_capita || row.value,
                  score: updatedData.income_per_capita_score || row.score,
                };
              case 4:
                return {
                  ...row,
                  score: updatedData.tourism_goal_score || row.score,
                };
              case 5:
                return {
                  ...row,
                  score: updatedData.centralization_dehstan_score || row.score,
                };
              case 6:
                return {
                  ...row,
                  score: updatedData.centralization_bakhsh_score || row.score,
                };
              default:
                return row;
            }
          })
        );
      } catch (error) {
        console.error("خطا در به‌روزرسانی اطلاعات:", error);
        toast.error("خطا در به‌روزرسانی اطلاعات");
      } finally {
        setLoading(false);
      }
    }
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
  };

  const handleSaveVillageInformation = () => {
    setIsUpdatingVillageRate(true);
    console.log("Saving changes: ", upgradeVillageRanks);
    setIsUpdatingVillageRate(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "parameter",
        header: "پارامتر",
        size: 150,

        Cell: ({ cell }) => {
          return <div>{cell.getValue()}</div>;
        },
      },
      {
        accessorKey: "year",
        header: "سال",
        size: 150,
        Cell: ({ cell, row }) => {
          const isYearEditing = row.original.isYearEditing;
          return isYearEditing && row.original.id === 3 ? (
            <TextField
              value={cell.getValue()}
              onChange={(e) =>
                handleEditCell(row.original.id, "year", e.target.value)
              }
              onBlur={() =>
                handleEditCell(row.original.id, "isYearEditing", false)
              }
              autoFocus
              inputProps={{
                style: { height: 1 },
              }}
            />
          ) : (
            <div
              onClick={() => {
                if (row.original.id === 3) {
                  handleEditCell(row.original.id, "isYearEditing", true);
                }
              }}
            >
              {cell.getValue()}
            </div>
          );
        },
      },
      {
        accessorKey: "value",
        header: "مقدار",
        size: 150,
        Cell: ({ cell, row }) => {
          const isValueEditing = row.original.isValueEditing;
          return isValueEditing &&
            (row.original.id === 2 || row.original.id === 3) ? (
            <TextField
              value={cell
                .getValue()
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              onChange={(e) =>
                handleEditCell(
                  row.original.id,
                  "value",
                  e.target.value.replace(/,/g, "")
                )
              }
              onBlur={() =>
                handleEditCell(row.original.id, "isValueEditing", false)
              }
              autoFocus
              inputProps={{
                style: { height: 1 },
              }}
            />
          ) : (
            <div
              onClick={() => {
                if (row.original.id === 2 || row.original.id === 3) {
                  handleEditCell(row.original.id, "isValueEditing", true);
                }
              }}
            >
              {cell.getValue() === true ? (
                <i className="ri-checkbox-circle-line h-5 text-success"></i>
              ) : cell.getValue() === false ? (
                <i className="ri-close-circle-line text-error h-5"></i>
              ) : (
                cell
                  .getValue()
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",") // جداسازی سه رقم
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "score",
        header: "امتیاز",
        size: 150,
        Cell: ({ cell }) => <div>{cell.getValue()}</div>,
      },
    ],
    [anchorEl, selectedRow, details, upgradeVillageRanks]
  );

  const table = useCustomTable(columns, upgradeVillageRanks, {
    enablePagination: false,
    enableTopToolbar: false,
    enableFilters: false,
    enableSorting: false,
    enablePagination: false,
    enableTopToolbar: false,
    enableColumnActions: false,
    initialState: {
      density: "compact",
    },
    muiTableBodyCellProps: {
      style: {
        textAlign: "right",
        verticalAlign: "middle",
        whiteSpace: "nowrap",
      },
    },
    renderBottomToolbarCustomActions: () => {
      return (
        <Box
          className={`grid grid-cols-4 gap-2 items-center justify-between mt-1 w-full`}
        >
          <Box className="col-span-2">
            {newGrade > details.grade && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveVillageInformation}
              >
                ذخیره و ارسال درخواست ارتقاء درجه
              </Button>
            )}
          </Box>
          {Object.values(validationErrors).some((error) => !!error) && (
            <Typography color="error">
              لطفا خطاها را قبل از ارسال اصلاح کنید
            </Typography>
          )}
          <Typography textAlign={"center"}>
            درجه نهایی<p className="text-primary font-bold">{newGrade}</p>
          </Typography>
          <Typography textAlign={"center"}>
            امتیاز
            <p className="text-primary font-bold">{totalScore}</p>
          </Typography>
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

export default UpgradeVillageTable;
