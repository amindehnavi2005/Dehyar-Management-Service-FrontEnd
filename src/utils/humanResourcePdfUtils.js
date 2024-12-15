import { DownloadHumanResourcePdf } from "@/Services/humanResources";
import HumanResourceDTO from "@/utils/HumanResourceDTO";
import MyDocument from "@components/MyDocument";
import { pdf } from "@react-pdf/renderer";
import { toast } from "react-toastify";
import api from "@/utils/axiosInstance";

export const downloadHumanResourcePdf = async (
  humanResourceId,
  humanContractId
) => {
  try {
    const response = await api.get(
      `${DownloadHumanResourcePdf()}?human_resource_id=${humanResourceId}&human_contract_id=${humanContractId}`,
      { requiresAuth: true }
    );

    const humanResourceData = response.data;
    const data = new HumanResourceDTO(humanResourceData);    
    const doc = <MyDocument data={data} />;
    const asPdf = pdf([]);
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    toast.success("محاسبه موفق بود");
  } catch (error) {
    toast.error("خطا در نمایش حکم کارگزینی");
    return error;
  }
};
