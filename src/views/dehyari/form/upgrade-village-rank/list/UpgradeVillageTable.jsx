"use client";
import api from "@/utils/axiosInstance";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import useCustomTable from "@/hooks/useCustomTable";

const UpgradeVillageTable = ({
  loading,
  setLoading,
  handleAddEventSidebarToggle,
  addEventSidebarOpen,
}) => {
  // States
  const [upgradeVillageRanks, setUpgradeVillageRanks] = useState([
    { id: 1, parameter: "جمعیت", year: 1397, value: 12000, score: 5 },
    {
      id: 2,
      parameter: "وسعت (هکتار)",
      year: "-",
      value: 12000,
      score: 8,
      isValueEditing: false,
    },
    {
      id: 3,
      parameter: "درآمد (میلیون ریال)",
      year: 1397,
      value: 12000,
      score: 3,
      isYearEditing: false,
      isValueEditing: false,
    },
    { id: 4, parameter: "هدف گردشگری", year: "-", value: false, score: 6 },
    { id: 5, parameter: "مرکز دهستان", year: "-", value: true, score: 2 },
    { id: 6, parameter: "مرکز بخش", year: "-", value: false, score: 5 },
  ]);
  const [editedVillageRate, setEditedVillageRate] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isUpdatingVillageRate, setIsUpdatingVillageRate] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);

  const fetchVillageRank = async () => {};

  useEffect(() => {
    loading ? fetchVillageRank() : null;
  }, [loading]);

  // Handlers
  const handleEditCell = (rowId, key, value) => {
    setUpgradeVillageRanks((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
    );
    console.log("Upgrade Village Ranks => ", upgradeVillageRanks);

    setEditedVillageRate((prev) => ({
      ...prev,
      [rowId]: true,
    }));
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
          console.log(
            `Is Editing ${row.original.id} => ${row.original.isYearEditing} Year `
          );
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
          console.log(
            `Is Editing ${row.original.id} => ${row.original.isValueEditing} Value `
          );
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
      const totalScore = upgradeVillageRanks.reduce((accumulator, current) => {
        return accumulator + current.score;
      }, 0);
      return (
        <Box
          className={`grid grid-cols-4 gap-2 items-center justify-between mt-1 w-full`}
        >
          <Box className="col-span-2">نتیجه بررسی امتیازات محاسبه شده :</Box>
          {Object.values(validationErrors).some((error) => !!error) && (
            <Typography color="error">
              لطفا خطاها را قبل از ارسال اصلاح کنید
            </Typography>
          )}
          <div></div>
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
