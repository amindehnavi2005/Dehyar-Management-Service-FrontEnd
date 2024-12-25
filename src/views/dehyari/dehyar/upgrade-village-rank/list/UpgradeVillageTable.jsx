"use client";
import api from "@/utils/axiosInstance";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import useCustomTable from "@/hooks/useCustomTable";
import { getDivisionInformation } from "@/Services/UpgradeVillage";
import { me } from "@/Services/Auth/AuthService";

const UpgradeVillageTable = ({
  details,
  loading,
  setLoading,
  handleAddEventSidebarToggle,
  addEventSidebarOpen,
}) => {
  useEffect(() => {
    if (details) {
      setUpgradeVillageRanks(rebuildVillageRanks(details));
    }
  }, [details]);

  const [upgradeVillageRanks, setUpgradeVillageRanks] = useState([]);
  const rebuildVillageRanks = (details) => {
    console.log("Details => ", details);

    return [
      {
        id: 1,
        parameter: "جمعیت",
        year: (details?.populations && details?.populations[0]?.year) || "-",
        value:
          (details?.populations && details?.populations[0]?.population) || 0,
        score: 5,
      },
      {
        id: 2,
        parameter: "وسعت (هکتار)",
        year: "-",
        value: details?.area_hectares || 0,
        score: 8,
        isValueEditing: false,
      },
      {
        id: 3,
        parameter: "درآمد (میلیون ریال)",
        year: details?.incomes?.length || "-",
        value: details?.incomes?.length || "-",
        score: 3,
        isYearEditing: false,
        isValueEditing: false,
      },
      {
        id: 4,
        parameter: "هدف گردشگری",
        year: "-",
        value: details?.tourism_goal === 1,
        score: 6,
      },
      {
        id: 5,
        parameter: "مرکز دهستان",
        year: "-",
        value: details?.centralization === 1,
        score: 2,
      },
      {
        id: 6,
        parameter: "مرکز بخش",
        year: "-",
        value: details?.city_grade === 1,
        score: 5,
      },
    ];
  };
  const [editedVillageRate, setEditedVillageRate] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isUpdatingVillageRate, setIsUpdatingVillageRate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);

  const totalScore = useMemo(() => {
    return upgradeVillageRanks.reduce((accumulator, current) => {
      return accumulator + current.score;
    }, 0);
  }, [upgradeVillageRanks]);

  const [currentDegree, setCurrentDegree] = useState(totalScore);
  const [userDetails, setUserDetails] = useState();

  const handleEditCell = (rowId, key, value) => {
    setUpgradeVillageRanks((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
    );

    if (key === "value" || key === "year") {
      const newDegree = calculateNewDegree(upgradeVillageRanks);
      setCurrentDegree(newDegree);
    }
  };

  const calculateNewDegree = (villageRanks) => {
    return villageRanks.reduce((acc, curr) => acc + curr.score, 0);
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
    toast.success("تغییرات با موفقیت ذخیره شد");
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
    [anchorEl, selectedRow]
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
        textAlign: "center",
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
            {currentDegree == totalScore && (
              <Button variant="contained" color="primary">
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
            درجه نهایی<p className="text-primary font-bold">{totalScore}</p>
          </Typography>
          <Typography textAlign={"center"}>
            امتیاز<p className="text-primary font-bold">{totalScore}</p>
          </Typography>
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

export default UpgradeVillageTable;
