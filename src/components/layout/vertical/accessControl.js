// accessControl.js

import WORK_GROUPS from "./workGroups";

const accessControl = {
  [WORK_GROUPS.Dehyar]: [
    {
      label: "مرخصی",
      icon: <i className="ri-survey-line" />,
      href: "/dehyari/form/time-off",
    },
    {
      label: "ماموریت",
      icon: <i className="ri-sticky-note-add-line" />,
      href: "/dehyari/form/mission",
    },
    {
      label: "ماشین آلات",
      icon: <i className="ri-car-line" />,
      href: "/dehyari/form/machinery",
    },
    {
      label: "درجه بندی دهیاری",
      icon: <i className="ri-arrow-up-wide-fill" />,
      href: "/dehyari/form/upgrade-village-rank",
    },
  ],
  [WORK_GROUPS.Dehyar]: [
    {
      label: "مرخصی",
      icon: <i className="ri-survey-line" />,
      href: "/dehyari/form/time-off",
    },
    {
      label: "ماموریت",
      icon: <i className="ri-sticky-note-add-line" />,
      href: "/dehyari/form/mission",
    },
    {
      label: "ماشین آلات",
      icon: <i className="ri-car-line" />,
      href: "/dehyari/form/machinery",
    },
    {
      label: "درجه بندی دهیاری",
      icon: <i className="ri-arrow-up-wide-fill" />,
      href: "/dehyari/dehyar",
    },
  ],
  [WORK_GROUPS.CFO]: [
    {
      label: "پرسنل دهیاری ها",
      icon: <i className="ri-group-line" />,
      href: "/dehyari/cfo/table",
    },
    {
      label: "تشکیلات دهیاری",
      icon: <i className="ri-organization-chart" />,
      href: "/dehyari",
    },
    {
      label: "ویرایش اطلاعات پرسنلی",
      href: "/dehyari/form/edit",
      showOnSidebar: false,
    },
  ],
  [WORK_GROUPS.Admin]: [
    {
      label: "مرخصی",
      icon: <i className="ri-survey-line" />,
      href: "/dehyari/form/time-off",
    },
    {
      label: "ماموریت",
      icon: <i className="ri-sticky-note-add-line" />,
      href: "/dehyari/form/mission",
    },
    {
      label: "ماشین آلات",
      icon: <i className="ri-car-line" />,
      href: "/dehyari/form/machinery",
    },
    {
      label: "درجه بندی دهیاری",
      icon: <i className="ri-arrow-up-wide-fill" />,
      href: "/dehyari/dehyar",
    },
    {
      label: "تشکیلات دهیاری",
      icon: <i className="ri-organization-chart" />,
      href: "/dehyari",
    },
    {
      label: "درجه بندی دهیاری",
      icon: <i className="ri-arrow-up-wide-fill" />,
      href: "/dehyari/dehyar",
    },
    {
      label: "ویرایش اطلاعات پرسنلی",
      href: "/dehyari/form/edit",
      showOnSidebar: false,
    },
    {
      label: "جدول خطا ها",
      icon: <i className="ri-error-warning-line" />,
      href: "/admin/logtable",
    },
    {
      label: "لیست نقش ها",
      icon: <i className="ri-admin-line" />,
      href: "/admin/roles",
    },
    {
      label: "درجه بندی",
      icon: <i className="ri-bar-chart-line" />,
      href: "/dehyari/form/grading-information-registration",
    },
    {
      label: "مدیریت کاربران",
      icon: <i className="ri-team-line" />,
      href: "/municipality/list",
    },
  ],
  [WORK_GROUPS.GOVERNOR]: [
    {
      label: "پرسنل دهیاری ها",
      icon: <i className="ri-group-line" />,
      href: "/dehyari/governor/table",
    },
    {
      label: "مدیریت کاربران",
      icon: <i className="ri-team-line" />,
      href: "/dehyari/governor/list",
    },
    {
      label: "درجه بندی دهیاری",
      icon: <i className="ri-arrow-up-wide-fill" />,
      href: "/dehyari/dehyar",
    },
  ],
  [WORK_GROUPS.BAKHSHDAR]: [
    {
      label: "پرسنل دهیاری ها",
      icon: <i className="ri-group-line" />,
      href: "/dehyari/bakhshdar/table",
    },
    {
      label: "درجه بندی دهیاری",  
      icon: <i className="ri-arrow-up-wide-fill" />,
      href: "/dehyari/bakhshdar/upgrade-village-rank",
    },
  ],
  [WORK_GROUPS.PUBLIC]: [
    {
      label: "صفحه عمومی",
      icon: <i className="ri-account-box-line" />,
      href: "/profile/complete",
    },
  ],
};

export default accessControl;
