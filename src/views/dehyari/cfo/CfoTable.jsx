"use client"
import React, {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {MaterialReactTable} from 'material-react-table';
import Chip from "@mui/material/Chip";
import {IconButton, Menu, MenuItem} from '@mui/material';
import axios from "axios";
import {DownloadHumanResourcePdf, GetHumanResourcesForCfo} from "@/Services/humanResources";
import contractType from "@data/contractType.json";
import PersonalOption from "@data/PersonalOption.json";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from 'next/link';
import {toast} from "react-toastify";
import MyDocument from "@components/MyDocument";
import {pdf} from "@react-pdf/renderer";

function CfoTable(props) {
    const [data, setData] = useState([]);
    const [humanResourceData, setHumanResourceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const {militaryServiceOptions, veteranStatusOptions, degreeOptions} = PersonalOption
    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };
    const handleDownloadPdf = async (row) => {
        try {
            const response = await axios.get(`${DownloadHumanResourcePdf()}?human_resource_id=${row.human_resource_id}`, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                }
            });

            const humanResourceData = response.data;
            const villages = humanResourceData.covered_villages.map(village => village.village.approved_name).join(' / ');
            const section = humanResourceData.locationData.regions.join(' / ');
            const cities = humanResourceData.locationData.cities.join(' / ');
            const state = humanResourceData.locationData.states.join(' / ');
            const total_salary = humanResourceData.salary.base_salary + humanResourceData.salary.history_benefits + humanResourceData.salary.job_benefits + humanResourceData.salary.child_benefits + humanResourceData.salary.home_benefits + humanResourceData.salary.food_benefits +humanResourceData.salary.warzone_benefits ?? 0+humanResourceData.salary.married_benefits ?? 0
            console.log(humanResourceData)
            const data = {
                "province": state,
                "county": cities,
                "section": section,
                "villageCount": humanResourceData.covered_villages.length,
                "villages": villages,
                "name": `${humanResourceData.full_name}`,
                "fatherName": `${humanResourceData.father_name}`,
                "nationalId": `${humanResourceData.nid}`,
                "maritalStatus": humanResourceData.married_status === 0 ? "مجرد" : "متاهل",
                "idNumber": humanResourceData.personal_id,
                "birthDate": humanResourceData.birth_date,
                "gender": humanResourceData.gender === 0 ? "زن" : "مرد",
                "childrenCount": humanResourceData.childrens.length,
                "militaryStatus": militaryServiceOptions.find(option => option.value == humanResourceData.nezam_vazife).label,
                "isaarStatus": veteranStatusOptions.find(option => option.value == humanResourceData.eisargari_status).label,
                "birthPlace": humanResourceData.birth_place,
                "issuePlace": humanResourceData.issue_place,
                "education": degreeOptions.find(option => option.value == humanResourceData.last_degree.education_degree).title,
                "major": humanResourceData.last_degree.education_field,
                "appointmentDate": " ",
                "experience": humanResourceData.some_month_history,
                "contractStartDate": humanResourceData.contract_start,
                "contractEndDate": humanResourceData.contract_end,
                "contractSubject": humanResourceData.title_contract,
                "contractDescription": humanResourceData.description_contract,
                "baseSalary": `${humanResourceData.salary.base_salary} ریال`,
                "yearlyBase": `${humanResourceData.salary.history_benefits} ریال`,
                "jobBonus": `${humanResourceData.salary.job_benefits} ریال`,
                "totalFixedWage": `${humanResourceData.salary.job_benefits + humanResourceData.salary.history_benefits + humanResourceData.salary.base_salary} ریال`,
                "familyAllowance": `${humanResourceData.salary.child_benefits} ریال`,
                "housingAllowance": `${humanResourceData.salary.home_benefits} ریال`,
                "householdAllowance": `${humanResourceData.salary.food_benefits} ریال`,
                "deprivationBonus": `${humanResourceData.salary.warzone_benefits ?? 0} ریال`,
                "married_benifits": `${humanResourceData.salary.married_benifits ?? 0} ریال`,
                "veteransBonus": "۰ ریال",
                "totalSalary": `${total_salary ?? 0} ریال`,
                "contractClause1": "طرف قرارداد تابع مقررات،ضوابط و آئین نامه های مربوط به دهیاری ، قانون کار و قانون تامین اجتماعی بوده و از مزایای قوانین مذکور بهره مند می شود",
                "contractClause2": "موارد خاتمه کار طرف قرارداد به استناد ماده ۲۱ قانون کار می باشد",
                "contractClause3": "ماموریت و مرخصی امورمالی دهیاری به استناد اصلاحیه ماده ۱۲ آئین نامه استخدامی دهیاری های کشور با تایید بخشدار صورت می گیرد",
                "contractClause4": "مزایای پایان قرارداد طبق قانون کار و براساس حقوق و دستمزد مندرج در قرارداد از محل اعتبارات دهیاری های بند ۲ طرف قرارداد پرداخت می شود",
                "commitment1": "طرف قرارداد متهعد است مطابق شرح وظایف مندرج در مقررات و ضوابط،نسبت به انجام موضوع قرارداد اقدام کند.",
                "commitment2": "طرف قرارداد اقرار می کند مشمول قانون منع مداخله کارکنان دولت در معالمات دولتی مصوب ۱۳۷۷ نیست .",
                "commitment3": "عقد قرارداد هیچ گونه تعهدی مبنی بر استخدام اعم از رسمی یا پیمانی اعم از سوی دهیاری برای طرف قرارداد ایجاد نمی کند.",
                "commitment4": "طرف قرارداد مسئول حفظ و نگهداری وسایل و اموال در اختیار است و در صورت ایجاد خسارت ،دهیاری می تواند از محل قرارداد خسارت را جبران کند",
                "signingNote": "امضای ذیل این قرارداد از سوی بخشدار صرفا جهت اجرای ماده ۱۶ اساسنامه ، تسهیلات و سازمان دهیاری ها مصوب ۱۳۸۰ و امضای مسئول امورمالی دهیاری دهیاری به استناد ماده ۱۱ آﺋین نامه استخدامی دهیاری های کشور می باشد دهیاری پاکل گراب به نمایندگی از دهیاری های بند ۲ این قرارداد به عنوان دهیاری کارفرما تعیین می گردد",
                "finalNote": "این قرارداد در ۵ نسخه تنظیم و هر نسخه حکم واحد را دارد و پس از امضا و مهر و ثبت معتبر خواهد بود",
                "executionDate": "۱۴۰۲/۰۱/۰۱",
                "uniqueId": "پیش فرض",
                "contractNumber": "۴۰۷ - ۱۴۰۲/۰۴/۲۶",
                "contractorName": "کبری جوانمردی",
                "employerName": "نعمت االله نوری",
                "centralGovernor": "صفیه علی اولاد",
                "sivanGovernor": "آزاد شریفی نژاد"
            };

            // Use MyDocument component to create the PDF document
            const doc = <MyDocument data={data}/>;
            const asPdf = pdf([]);
            asPdf.updateContainer(doc);
            asPdf.toBlob().then((blob) => {
                // Create a URL for the blob and an iframe to print the PDF
                const url = URL.createObjectURL(blob);
                const iframe = document.createElement('iframe');
                iframe.style.position = 'fixed';
                iframe.style.width = '0';
                iframe.style.height = '0';
                iframe.style.border = 'none';
                iframe.src = url;
                document.body.appendChild(iframe);
                iframe.onload = () => {
                    iframe.contentWindow.print();
                };
            });
        } catch (error) {
            console.error("Error fetching human resource data:", error);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(GetHumanResourcesForCfo(), {
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                    },
                });
                setData(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    toast.error(error.response.data.message || 'شما به محتوای این بخش دسترسی ندارید!!', {
                        position: "top-center"
                    });
                } else {
                    toast.error('خطا در دریافت اطلاعات');
                }
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const tableData = useMemo(() => data, [data]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'village',
                header: 'دهیاری',
                size: 150,
                Cell: ({cell}) => <div style={{textAlign: 'right'}}>{cell.getValue().approved_name}</div>,
            },
            {
                accessorKey: 'full_name',
                header: 'نام و نام خانوادگی',
                size: 150,
                Cell: ({cell}) => <div style={{textAlign: 'right'}}>{cell.getValue()}</div>,
            },
            {
                accessorKey: 'nid',
                header: 'کدملی',
                size: 150,
                Cell: ({cell}) => <div style={{textAlign: 'right'}}>{cell.getValue()}</div>,
            },
            {
                accessorKey: 'contract_type',
                header: 'نوع قرار داد',
                size: 150,
                Cell: ({cell}) => {
                    const role = cell.getValue();
                    return (
                        <div style={{textAlign: 'right'}}>
                            <Chip label={contractType[role]} color="primary"/>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'actions',
                header: 'عملیات',
                size: 150,
                Cell: ({row}) => (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        <IconButton
                            aria-label="more"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={(event) => handleClick(event, row)}
                            style={{paddingLeft: 0}}
                        >
                            <MoreVertIcon
                                style={{textAlign: "center", justifyContent: 'center', alignItems: 'center'}}/>
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                <Link href={`/dehyari/form?mode=edit&id=${row.original.id}`}>
                                    ویرایش
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={() => handleDownloadPdf(selectedRow.original)}>
                                حکم کارگزینی
                            </MenuItem>
                        </Menu>
                    </div>
                ),
            },
        ],
        [anchorEl, selectedRow]
    );

    if (loading) {
        return <div>در حال بارگذاری...</div>;
    }

    return (
        <MaterialReactTable
            columns={columns}
            data={tableData}
        />
    );
}

export default CfoTable;
