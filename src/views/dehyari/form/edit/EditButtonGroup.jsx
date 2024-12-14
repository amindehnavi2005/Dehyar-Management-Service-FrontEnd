import React from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { AnimatePresence, motion } from "framer-motion";

const EditButtonGroup = ({ onSubmit, onSwitch, showTable, isReadOnly }) => {
  const handleReturn = () => {
    window.history.back();
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <Box
          sx={{
            display: "grid",
            backgroundColor: "primary.main",
            p: 4,
            borderRadius: 1,
            gap: 2,
          }}
        >
          <AnimatePresence>
            <motion.div whileHover={{ scale: 0.95 }} whileTap={{ scale: 0.9 }}>
              <Button
                fullWidth
                variant={!showTable ? "contained" : "text"}
                color="inherit"
                onClick={() => onSwitch(false)}
                sx={{
                  backgroundColor: !showTable
                    ? "white"
                    : "rgba(255, 255, 255, 0.1)",
                  color: !showTable ? "primary.main" : "#fff",
                  "&:hover": {
                    backgroundColor: !showTable
                      ? "white"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                اطلاعات فردی
              </Button>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            <motion.div whileHover={{ scale: 0.95 }} whileTap={{ scale: 0.9 }}>
              <Button
                fullWidth
                variant={showTable ? "contained" : "text"}
                color="inherit"
                onClick={() => onSwitch(true)}
                sx={{
                  backgroundColor: showTable
                    ? "white"
                    : "rgba(255, 255, 255, 0.1)",
                  color: showTable ? "primary.main" : "#fff",
                  "&:hover": {
                    backgroundColor: showTable
                      ? "white"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                اطلاعات منابع انسانی
              </Button>
            </motion.div>
          </AnimatePresence>
        </Box>

        {!showTable && !isReadOnly && (
          <AnimatePresence>
            <motion.div whileHover={{ scale: 0.95 }} whileTap={{ scale: 0.9 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="bg-green-800"
                startIcon={<SaveIcon />}
                onClick={onSubmit}
              >
                ذخیره
              </Button>
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence>
          <motion.div whileHover={{ scale: 0.95 }} whileTap={{ scale: 0.9 }}>
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              startIcon={<KeyboardReturnIcon />}
              onClick={handleReturn}
              sx={{
                backgroundColor: "secondary.main",
                color: "secondary.contrastText",
                "&:hover": {
                  color: "black",
                },
              }}
            >
              بازگشت به کارتابل
            </Button>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default EditButtonGroup;
