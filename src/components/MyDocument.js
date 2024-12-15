import React from 'react';
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import moment from "moment-jalaali";
import NumberedText from './NumberedText'; // فرض کنیم این فایل را در همین دایرکتوری ذخیره کرده‌ایم

// ثبت فونت
Font.register({
    family: 'iranSans',
    fonts: [
        { src: '/fonts/IRANSans/ttf/IRANSansXFaNum-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/IRANSans/ttf/IRANSans-Bold.ttf', fontWeight: '500' },
    ]
});
moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

const styles = StyleSheet.create({
    page: {
        padding: 10,
        fontSize: 9,
        fontWeight: '100',
        fontFamily: 'iranSans',
        textAlign: 'right',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        backgroundColor: '#fff',
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 5,
        borderBottom: '1px solid black',
        paddingBottom: 2,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 10,
    },
    headerDate: {
        textAlign: 'left',
        fontSize: 9,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderCollapse: 'collapse', // Added
        marginBottom: 5,
        borderLeft: '1px solid #dfdfdf',
    },
    tableColHeader: {
        backgroundColor: '#EDEDED',
        padding: 2,
        border: '1px solid #dfdfdf',
        textAlign: 'right',
    },
    highlightedText: {
        color: 'red',
    },
    number: {
        marginRight: 2,
    },
    footer: {
        borderTop: '1px solid black',
        paddingTop: 5,
        marginTop: 10,
        fontSize: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    greyBackground: {
        backgroundColor: '#EDEDED',
        flexDirection: 'row-reverse',
    },
    centerAlign: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCol: {
        padding: 1.5,
        borderBottom: '1px solid #dfdfdf',
        borderRight: '1px solid #dfdfdf',
        textAlign: 'right',
        flexWrap: 'nowrap',
    },
    textCenter: {
        textAlign: 'center',
    },
    justifiedText: {
        textAlign: 'justify',
        padding: 5,
        margin: 5,
        lineHeight: 1.5,
        fontSize: 10,
    },
    highlightedRow: {
        backgroundColor: '#f0f0f0',
        flexDirection: 'row-reverse',
        borderBottom: 'none', // Remove bottom border to avoid double border
    },
    whiteRow: {
        backgroundColor: '#ffffff',
        flexDirection: 'row-reverse',
        flexWrap: 'nowrap',
        borderBottom: 'none', // Remove bottom border to avoid double border
    },
    tableRowLast: {
        flexDirection: 'row',
        borderBottom: '1px solid #dfdfdf', // Add bottom border for last row
    },
});

const Header = ({ title }) => (
    <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
    </View>
);

const TableRow = ({ rowStyle, data, isLastRow = false }) => (
    <View style={[styles.tableRow, rowStyle, isLastRow && styles.tableRowLast]}>
        {data.map((col, index) => (
            <View key={index} style={{ width: col.width || 'auto', ...styles.tableCol }}>
                <NumberedText text={col.text} showNumber={col.showNumber !== false} />
            </View>
        ))}
    </View>
);


const Footer = () => {
    const now = moment();
    const formattedDate = now.format('HH:mm:ss jYYYY/jMM/jDD dddd');

    return (
        <View style={styles.footer}>
            <Text>{formattedDate}</Text>
            <Text>پنجره واحد خدمات سازمان خدمات شهرداری ها و دهیاری ها</Text>
        </View>
    );
};
const renderTableRowsByJobTitle = (data, jobTitleId) => {
    let rowNumber = 1;

    const getRowData = (text, showNumber = true, width = 'auto') => ({
        number: rowNumber++,
        text,
        showNumber,
        width
    });

    if (jobTitleId === 3 || jobTitleId === 4) {
        return (
            <>
                <TableRow
                    rowStyle={styles.highlightedRow}
                    data={[
                        getRowData(`استان: ${data.province}`, true, '25%'),
                        getRowData(`شهرستان: ${data.county}`, false, '25%'),
                        getRowData(`بخش: ${data.section}`, false, '30%'),
                        getRowData(`تعداد دهیاری: ${data.villageCount}`, false, '20%')
                    ]}
                />
                <TableRow
                    rowStyle={styles.highlightedRow}
                    data={[
                        getRowData(`دهیاری های طرف قرارداد: ${data.villages}`, true, '100%')
                    ]}
                />
            </>
        );
    } else if (jobTitleId === 1) {
        if (data.covered_villages.length === 1) {
            return (
                <>
                    <TableRow
                        rowStyle={styles.highlightedRow}
                        data={[
                            getRowData(`استان: ${data.province}`, true, '20%'),
                            getRowData(`شهرستان: ${data.county}`, false, '20%'),
                            getRowData(`بخش: ${data.section}`, false, '20%'),
                            getRowData(`دهیاری: ${data.covered_villages[0].village.approved_name}`, false, '20%'),
                            getRowData(`درجه دهیاری: ${data?.lastGrade}`, false, '20%')
                        ]}
                    />
                </>
            );
        } else {
            return (
                <>
                </>
            );
        }
    } else {
        return (
            <>
                <Text>نا مشخص</Text>
            </>
        );
    }
};
const renderSignatoriesByJobTitle = (data) => {
    if (data.job_type_id === 1) {
        return (
            <>
                <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', flexWrap: 'nowrap' }}>
                    <View style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, marginBottom: 5 }}>{`بخشداری ${data.section}`}</Text>
                        <Text style={{ fontSize: 8 }}>{data.signatureData.goverment.full_name}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                        <Text style={{
                            fontSize: 10,
                            marginBottom: 5
                        }}>{`مسئول امور مالی دهیاری`}</Text>
                        <Text style={{ fontSize: 8 }}>{data.signatureData.financial_responsible.full_name}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                        <Text style={{
                            fontSize: 10,
                            marginBottom: 5
                        }}>{`طرف قرارداد (${data.covered_villages[0].village.approved_name})`}</Text>
                        <Text style={{ fontSize: 8 }}>{data.name}</Text>
                    </View>
                </View>
            </>
        );
    } else if (data.job_type_id === 3) {
        return (
            <>
                <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', flexWrap: 'nowrap' }}>
                    {data.signatureData.covered_villages.map((region, index) => (
                        <View key={index}
                            style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                            <Text style={{
                                fontSize: 10,
                                marginBottom: 5
                            }}> {` بخشدار ${region.region_name}`}</Text>
                            <Text style={{ fontSize: 8 }}>{region.bakhshdar.full_name}</Text>
                        </View>
                    ))}
                    <View style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, marginBottom: 5 }}>{`دهیاری منتخب (${data.villageName})`}</Text>
                        <Text style={{ fontSize: 8 }}>{data.signatureData.village_employer.full_name}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, marginBottom: 5 }}>{`طرف قرارداد (امور مالی)`}</Text>
                        <Text style={{ fontSize: 8 }}>{data.name}</Text>
                    </View>
                </View>
            </>
        );
    } else if (data.job_type_id === 4) {
        return (
            <>
                <View style={{ flexDirection: 'row', backgroundColor: '#ffffff', flexWrap: 'nowrap' }}>
                    {data.signatureData.covered_villages.map((region, index) => (
                        <View key={index}
                            style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                            <Text style={{
                                fontSize: 10,
                                marginBottom: 5
                            }}> {` بخشدار ${region.region_name}`}</Text>
                            <Text style={{ fontSize: 8 }}>{region.bakhshdar.full_name}</Text>
                        </View>
                    ))}
                    <View style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, marginBottom: 5 }}>{`مسئول امور مالی دهیاری ها`}</Text>
                        <Text style={{ fontSize: 8 }}>{data.signatureData.financial_responsible}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, marginBottom: 5 }}>{`دهیاری منتخب (${data.villageName})`}</Text>
                        <Text style={{ fontSize: 8 }}>{data.signatureData.village_employer.full_name}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 10, border: '1px solid #dfdfdf', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, marginBottom: 5 }}>{`طرف قرارداد (امور فنی)`}</Text>
                        <Text style={{ fontSize: 8 }}>{data.name}</Text>
                    </View>
                </View>
            </>
        );
    }
};

const renderRemainDay = (contract_type, data) => {
    if (contract_type == 30) {
        return (
            <>
                <View style={[styles.tableRow]}>
                    <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Text style={{ marginRight: 4 }}>ریال</Text>
                            <Text>{data.remainDay}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 2.130, ...styles.tableCol, ...styles.textCenter }}>
                        <Text>:مابه التفاوت روز های کارکرد</Text>
                    </View>
                </View>
            </>
        );
    }
};

const renderJobType = (data) => {
    const jobTypeId = data.job_type_id;
    if (jobTypeId === 1) {
        return ':مزایای سرپرستی';
    } else if (jobTypeId === 3 || jobTypeId === 4) {
        return ':حق مسئولیت ';
    } else {
        return '';
    }
};

const MyDocument = ({ data }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.container}>
                <Header title={`قرارداد${data.convertStatus ? " دائم" : ""} مدت معین و حکم حقوقی ${data.jobName} ${data.contractType}`} />

                <View style={[styles.table]}>
                    {renderTableRowsByJobTitle(data, data.job_type_id)}
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            { width: '40%', text: `نام و نام خانوادگی : ${data.name}` },
                            { width: '25%', text: `نام پدر : ${data.fatherName}` },
                            { width: '35%', text: `کد ملی : ${data.nationalId}` },
                        ]}
                    />
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            { width: '20%', text: `وضعیت تاهل: ${data.maritalStatus}` },
                            { width: '30%', text: `شماره شناسنامه: ${data.idNumber}` },
                            { width: '30%', text: `تاریخ تولد: ${data.birthDate}` },
                            { width: '20%', text: `جنسیت: ${data.gender}` },
                        ]}
                    />
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            { width: '20%', text: `تعداد فرزندان: ${data.childrenCount}` },
                            { width: '40%', text: `وضعیت ایثارگری: ${data.isaarStatus}` },
                            { width: '40%', text: `وضعیت نظام وظیفه: ${data.militaryStatus}` },
                        ]}
                    />
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            { width: '40%', text: `مدرک تحصیلی: ${data.education}` },
                            { width: '60%', text: `رشته تحصیلی: ${data.major}` }
                        ]}
                    />
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            { width: '30%', text: `محل تولد: ${data.birthPlace}` },
                            { width: '30%', text: `محل صدور شناسنامه: ${data.issuePlace}` },
                            { width: '40%', text: `سمت: ${data.jobName}` }
                        ]}
                    />
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            {
                                width: '50%',
                                text: `مدت این قرارداد: از تاریخ : ${data.contractStartDate} تا تاریخ : ${data.contractEndDate}`
                            },
                            { width: '25%', text: `تاریخ انتصاب: ${data.appointmentDate}` },
                            { width: '25%', text: `سابقه کار (ماه) : ${data.experience}` }
                        ]}
                    />
                    <TableRow
                        rowStyle={[styles.whiteRow]}
                        data={[
                            { width: '100%', text: `موضوع قرارداد: ${data.contractSubject}` }
                        ]}
                    />
                    <View style={[styles.tableRow, {
                        flexDirection: 'row-reverse', borderRight: '1px solid #dfdfdf',
                    }]}>
                        <View style={{
    width: '40%',
    margin: 10,
    lineHeight: 2,
    direction: 'rtl',
    position: 'relative',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap', 
    marginBottom: 2,
}}>
    <Text style={{
        textAlign: 'right',
        direction: 'rtl',
        writingDirection: 'rtl',
        width: '100%',
    }}>
        {data.contractDescription.split('\n')}
    </Text>
</View>
                        <View style={{ width: '60%' }}>
                            <View style={[styles.tableRow, styles.greyBackground]}>
                                <View
                                    style={{ width: '100%', ...styles.tableColHeader, ...styles.textCenter, ...styles.centerAlign }}>
                                    <Text>الف- مزد ثابت</Text>
                                </View>
                                <View style={{ width: '100%' }}>
                                    <View style={[styles.tableRow, styles.greyBackground]}>
                                        <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                            <Text>:حقوق مبنا</Text>
                                        </View>
                                        <View style={{
                                            width: '50%', ...styles.tableCol, ...styles.textCenter,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <Text style={{ marginRight: 4 }}>ریال</Text>
                                            <Text>{data.baseSalary}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow, styles.greyBackground]}>
                                        <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                            <Text>:پایه سنواتی</Text>
                                        </View>
                                        <View style={{
                                            width: '50%', ...styles.tableCol, ...styles.textCenter,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <Text style={{ marginRight: 4 }}>ریال</Text>
                                            <Text>{data.yearlyBase}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow, styles.greyBackground]}>
                                        <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                            <Text>:فوق‌العاده شغل</Text>
                                        </View>
                                        <View style={{
                                            width: '50%', ...styles.tableCol, ...styles.textCenter,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <Text style={{ marginRight: 4 }}>ریال</Text>
                                            <Text>{data.jobBonus}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.tableRow, styles.greyBackground]}>
                                        <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                            <Text>{renderJobType(data)}</Text>
                                        </View>
                                        <View style={{
                                            width: '50%', ...styles.tableCol, ...styles.textCenter,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start'
                                        }}>
                                            <Text style={{ marginRight: 4 }}>ریال</Text>
                                            <Text>{data.supervisor_benefits}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.tableRow]}>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <Text style={{ marginRight: 4 }}>ریال</Text>
                                        <Text>{data.totalFixedWage}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <Text>:جمع مزد ثابت</Text>
                                </View>
                            </View>
                            <View style={[styles.tableRow]}>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <Text style={{ marginRight: 4 }}>ریال</Text>
                                        <Text>{data.married_benifits}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <Text>:حق تاهل</Text>
                                </View>
                            </View>
                            <View style={[styles.tableRow]}>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <Text style={{ marginRight: 4 }}>ریال</Text>
                                        <Text>{data.familyAllowance}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <Text>:کمک هزینه عائله‌مندی(حق اولاد)</Text>
                                </View>
                            </View>
                            {renderRemainDay(data.contract_type_id, data)}
                            <View style={[styles.tableRow]}>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <Text style={{ marginRight: 4 }}>ریال</Text>
                                        <Text>{data.housingAllowance}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <Text>:کمک هزینه مسکن</Text>
                                </View>
                            </View>

                            <View style={[styles.tableRow]}>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <Text style={{ marginRight: 4 }}>ریال</Text>
                                        <Text>{data.householdAllowance}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <Text>:کمک هزینه اقلام مصرفی خانوار</Text>
                                </View>
                            </View>
                            <View style={[styles.tableRow]}>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0
                                    }}>
                                        <Text style={{ marginRight: 4 }}>ریال</Text>
                                        <Text>{data.deprivationBonus}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    width: '50%', ...styles.tableCol, ...styles.textCenter,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
                                }}>
                                    <Text>:فوق العاده محرومیت از تسهیلات زندگی</Text>
                                </View>
                            </View>
                            <View style={[styles.tableRow]}>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <Text style={{ marginRight: 4 }}>ریال</Text>
                                        <Text>{data.veteransBonus}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <Text>:فوق العاده ایثارگری</Text>
                                </View>
                            </View>

                            <View style={[styles.tableRow]}>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <Text style={{ marginRight: 4 }}>ریال</Text>
                                        <Text>{data.totalSalary}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '50%', ...styles.tableCol, ...styles.textCenter }}>
                                    <Text>:جمع حقوق مزایا</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <TableRow
                        rowStyle={[styles.whiteRow, { borderTop: '1px solid #dfdfdf', }]}
                        data={[
                            {
                                width: '100%',
                                text: `${data.contractClause1}`
                            }
                        ]}
                    />

                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            {
                                width: '100%',
                                text: `${data.contractClause2}`
                            }
                        ]}
                    />
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            {
                                width: '100%',
                                text: `.${data.contractClause3}`
                            }
                        ]}
                    />
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            {
                                width: '100%',
                                text: `.${data.contractClause4}`
                            }
                        ]}
                    />
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            {
                                width: '100%',
                                text: `: تعهدات قرارداد \n${data.commitment1}\n ${data.commitment2}\n ${data.commitment3}\n ${data.commitment4}`,
                                style: {
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    padding: '5px',
                                    width: '100%',
                                    whiteSpace: 'pre-wrap'
                                }
                            }
                        ]}
                    />

                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            {
                                width: '100%',
                                text: (
                                    <Text>
                                        {data.signingNote}
                                    </Text>
                                )
                            }
                        ]}
                    />
                    <TableRow
                        rowStyle={styles.whiteRow}
                        data={[
                            {
                                width: '100%',
                                text: `${data.finalNote}`
                            }
                        ]}
                    />
                    <TableRow
                        rowStyle={[styles.whiteRow]}
                        data={[
                            { width: '30%', text: `تاریخ اجرای قرارداد: ${data.executionDate}` },
                            { width: '45%', text: `شناسه یکتا : ${data.uniqueId}` },
                            { width: '35%', text: `شماره و تاریخ قرارداد: ${data.contractNumber}` }
                        ]}
                    />
                    {renderSignatoriesByJobTitle(data)}

                </View>

                <Footer />
            </View>
        </Page>
    </Document>
);

export default MyDocument;


