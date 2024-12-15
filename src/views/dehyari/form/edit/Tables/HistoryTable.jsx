import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button } from "@mui/material";
import axios from "axios";
import HistoryTableModal from "@views/dehyari/form/edit/Tables/HistoryModal/HistoryTableModal";
import { downloadHumanResourcePdf } from "@/utils/humanResourcePdfUtils";
import { getJobTitleLabel } from "@data/jobTitles";
import { toast } from "react-toastify";
import { convertUnixToJalali } from "@utils/dateConverter";
import CustomIconButton from "@core/components/mui/IconButton";
import Tooltip from "@mui/material/Tooltip";
import WorkFlowDialog from "@views/dehyari/form/workflow/WorkFlowDialog";
import WorkFlowPopup from "@views/dehyari/form/workflow/WorkFlowPopup";
import { translateContractState } from "@utils/contractStateTranslator";
import ContractStateChip from "@components/badges/ContractStateChip";
import { HumanContract } from "@/Services/humanResources";
import useCustomTable from "@/hooks/useCustomTable";

const HistoryTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contractStateApprovedExists, setContractStateApprovedExists] =
    useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    if (data.length === 0) {
      // اگر هیچ داده‌ای وجود ندارد، اجازه افزودن قرارداد جدید داده می‌شود.
      setEditMode(false);
      setEditId(null);
      setOpenModal(true);
    } else if (!contractStateApprovedExists) {
      toast.warning(
        "بعد از تایید نهایی حکم جاری امکان ثبت قرارداد جدید وجود خواهد داشت."
      );
    } else {
      setEditMode(false);
      setEditId(null);
      setOpenModal(true);
    }
  };

  const handleEdit = (row) => {
    setEditMode(true);
    setEditId(row.original.id);
    setOpenModal(true);
    handleCloseMenu();
  };

  const queryParams = new URLSearchParams(window.location.search);
  const param = queryParams.get("param");
  const userId = queryParams.get("id");
  const salaryId = queryParams.get("salary_id");
  const handleDownloadPdf = async (row) => {
    downloadHumanResourcePdf(userId, row.original.human_contract_id);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${HumanContract()}/${param}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const allContractsApproved = response.data.every(
          (record) => record.contract_state === "approved"
        );
        setContractStateApprovedExists(allContractsApproved); // بروزرسانی وضعیت اگر تمام قراردادها تایید شده باشند
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${HumanContract()}/${param}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "contract_start",
        header: "تاریخ شروع قرارداد",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>
            {convertUnixToJalali(cell.getValue())}
          </div>
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
        accessorKey: "job_type_id",
        header: "پست سازمانی",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>
            {getJobTitleLabel(cell.getValue())}
          </div>
        ),
      },
      {
        accessorKey: "contract_end",
        header: "تاریخ پایان قرارداد",
        size: 150,
        Cell: ({ cell }) => (
          <div style={{ textAlign: "right" }}>
            {convertUnixToJalali(cell.getValue())}
          </div>
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
            {row.original.contract_state == "draft" && (
              <Tooltip title="حذف" placement={"top"}>
                <CustomIconButton
                  color={"error"}
                  onClick={() => {
                    row.original.contract_state == "draft"
                      ? toast.warning("این قابلیت هنوز افزوده نشده است")
                      : toast.error("شما اجازه حذف این قرارداد را ندارید");
                  }}
                  className={"rounded-full"}
                >
                  <i className="ri-delete-bin-7-line" />
                </CustomIconButton>
              </Tooltip>
            )}
            {(row.original.contract_state == "draft" ||
              row.original.contract_state ==
                "rejected_to_financial_officer") && (
              <Tooltip title="ویرایش" placement={"top"}>
                <CustomIconButton
                  color={"primary"}
                  onClick={() => {
                    row.original.contract_state == "draft" ||
                    row.original.contract_state ==
                      "rejected_to_financial_officer"
                      ? handleEdit(row)
                      : toast.error("شما اجازه ویرایش این قرارداد را ندارید");
                  }}
                  className={"rounded-full"}
                >
                  <i className="ri-edit-box-line" />
                </CustomIconButton>
              </Tooltip>
            )}
            <Tooltip title="دانلود PDF" placement={"top"}>
              <CustomIconButton
                color={"secondary"}
                onClick={() => {
                  handleDownloadPdf(row);
                }}
                className={"rounded-full"}
              >
                <i className="ri-printer-line" />
              </CustomIconButton>
            </Tooltip>
            <Tooltip title="پایان کار" placement={"top"}>
              <CustomIconButton
                color={"warning"}
                onClick={() => {
                  toast.warning("این قابلیت هنوز افزوده نشده است");
                }}
                className={"rounded-full"}
              >
                <i className="ri-indeterminate-circle-line" />
              </CustomIconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [anchorEl, selectedRow]
  );

  const table = useCustomTable(columns, data, {
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          disabled={!contractStateApprovedExists}
        >
          افزودن قرارداد
        </Button>
      </Box>
    ),
    state: {
      isLoading: loading,
      showProgressBars: loading,
    },
  });

  return (
    <div>
      <MaterialReactTable table={table} />
      <HistoryTableModal
        open={openModal}
        loading={loading}
        setLoading={setLoading}
        handleClose={() => setOpenModal(false)}
        refreshData={fetchData}
        mode={editMode ? "edit" : "create"}
        editId={editId}
      />
      <WorkFlowPopup open={dialogOpen} setOpen={setDialogOpen} id={salaryId} />
    </div>
  );
};

export default HistoryTable;
