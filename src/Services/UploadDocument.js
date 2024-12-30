import React, { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import { Box, Button, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

registerPlugin(FilePondPluginFileEncode);

const DocumentUpload = () => {
  const { setValue } = useFormContext();
  const [files, setFiles] = useState([]);
  const pondRef = useRef(null);

  const handleFileChange = (fileItems) => {
    if (fileItems.length > 0) {
      const file = fileItems[0].file;
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      const validTypes = ["application/pdf"];

      if (file.size > maxSizeInBytes) {
        toast.error("حجم فایل نباید بیشتر از 2MB باشد");
        pondRef.current.removeFile(fileItems[0].id);
        return;
      }

      if (!validTypes.includes(file.type)) {
        toast.error("فقط فایل‌های PDF مجاز هستند");
        pondRef.current.removeFile(fileItems[0].id);
        return;
      }

      const base64 = fileItems[0].getFileEncodeBase64String();
      setValue("uploadedDocument", base64);
    } else {
      setValue("uploadedDocument", "");
    }
    setFiles(fileItems);
  };

  return (
    <Box>
      <FilePond
        ref={pondRef}
        files={files}
        onupdatefiles={handleFileChange}
        allowMultiple={false}
        name="file"
        labelIdle='فایل پیوست خود را اینجا بکشید یا <span class="filepond--label-action">انتخاب کنید</span>'
        acceptedFileTypes={["application/pdf"]}
        maxFileSize="2MB"
        fileValidateTypeLabelExpectedTypes="فقط فایل‌های PDF مجاز هستند"
        fileValidateSizeLabelMaxFileSizeExceeded="حجم فایل نباید بیشتر از 2MB باشد"
        fileValidateSizeLabelMaxFileSize="حجم فایل مجاز: {filesize}"
      />
      <ToastContainer />
    </Box>
  );
};

export default DocumentUpload;
