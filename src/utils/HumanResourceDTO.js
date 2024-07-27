import PersonalOption from "@data/PersonalOption.json";

const {militaryServiceOptions, veteranStatusOptions, degreeOptions} = PersonalOption

class HumanResourceDTO {
    constructor(humanResourceData) {
        this.province = this.joinArray(humanResourceData.states);
        this.county = this.joinArray(humanResourceData.cities);
        this.section = this.joinArray(humanResourceData.regions);
        this.villageCount = convertToPersianNumbers(humanResourceData.covered_villages?.length || 0);
        this.villages = this.joinArray(humanResourceData.covered_villages?.map(village => village.village.approved_name));
        this.name = humanResourceData.full_name || '';
        this.fatherName = humanResourceData.father_name || '';
        this.nationalId = convertToPersianNumbers(humanResourceData.nid || '');
        this.maritalStatus = humanResourceData.married_status === 0 ? "مجرد" : "متاهل";
        this.idNumber = convertToPersianNumbers(humanResourceData.personal_id || '');
        this.birthDate = convertToPersianNumbers(humanResourceData.birth_date || '');
        this.gender = humanResourceData.gender === 0 ? "زن" : "مرد";
        this.childrenCount = convertToPersianNumbers(humanResourceData.childrens?.length || 0);
        this.militaryStatus = militaryServiceOptions.find(option => option.value == humanResourceData.nezam_vazife)?.label || '';
        this.isaarStatus = veteranStatusOptions.find(option => option.value == humanResourceData.eisargari_status)?.label || '';
        this.birthPlace = humanResourceData.birth_place || '';
        this.issuePlace = humanResourceData.issue_place || '';
        this.education = degreeOptions.find(option => option.value == humanResourceData.last_degree.education_degree)?.title || '';
        this.major = humanResourceData.last_degree.education_field || '';
        this.appointmentDate = convertToPersianNumbers(" ");
        this.experience = convertToPersianNumbers(humanResourceData.some_month_history || '');
        this.contractStartDate = convertToPersianNumbers(humanResourceData.contract_start || '');
        this.contractEndDate = convertToPersianNumbers(humanResourceData.contract_end || '');
        this.contractSubject = humanResourceData.title_contract || '';
        this.contractDescription = humanResourceData.description_contract || '';
        this.baseSalary = `${convertToPersianNumbers(humanResourceData.salary?.base_salary || 0)} ریال`;
        this.yearlyBase = `${convertToPersianNumbers(humanResourceData.salary?.history_benefits || 0)} ریال`;
        this.jobBonus = `${convertToPersianNumbers(humanResourceData.salary?.job_benefits || 0)} ریال`;
        this.totalFixedWage = `${convertToPersianNumbers((humanResourceData.salary?.job_benefits || 0) + (humanResourceData.salary?.history_benefits || 0) + (humanResourceData.salary?.base_salary || 0))} ریال`;
        this.familyAllowance = `${convertToPersianNumbers(humanResourceData.salary?.child_benefits || 0)} ریال`;
        this.housingAllowance = `${convertToPersianNumbers(humanResourceData.salary?.home_benefits || 0)} ریال`;
        this.householdAllowance = `${convertToPersianNumbers(humanResourceData.salary?.food_benefits || 0)} ریال`;
        this.deprivationBonus = `${convertToPersianNumbers(humanResourceData.salary?.warzone_benefits || 0)} ریال`;
        this.married_benifits = `${convertToPersianNumbers(humanResourceData.salary?.married_benefits || 0)} ریال`;
        this.supervisor_benefits = `${convertToPersianNumbers(humanResourceData.salary?.supervisor_benefits || 0)} ریال`;
        this.veteransBonus = "۰ ریال";
        this.totalSalary = `${convertToPersianNumbers(this.calculateTotalSalary(humanResourceData.salary))} ریال`;
        this.contractClause1 = "طرف قرارداد تابع مقررات،ضوابط و آئین نامه های مربوط به دهیاری ، قانون کار و قانون تامین اجتماعی بوده و از مزایای قوانین مذکور بهره مند می شود";
        this.contractClause2 = "موارد خاتمه کار طرف قرارداد به استناد ماده ۲۱ قانون کار می باشد";
        this.contractClause3 = "ماموریت و مرخصی امورمالی دهیاری به استناد اصلاحیه ماده ۱۲ آئین نامه استخدامی دهیاری های کشور با تایید بخشدار صورت می گیرد";
        this.contractClause4 = "مزایای پایان قرارداد طبق قانون کار و براساس حقوق و دستمزد مندرج در قرارداد از محل اعتبارات دهیاری های بند ۲ طرف قرارداد پرداخت می شود";
        this.commitment1 = "طرف قرارداد متهعد است مطابق شرح وظایف مندرج در مقررات و ضوابط،نسبت به انجام موضوع قرارداد اقدام کند.";
        this.commitment2 = "طرف قرارداد اقرار می کند مشمول قانون منع مداخله کارکنان دولت در معالمات دولتی مصوب ۱۳۷۷ نیست .";
        this.commitment3 = "عقد قرارداد هیچ گونه تعهدی مبنی بر استخدام اعم از رسمی یا پیمانی اعم از سوی دهیاری برای طرف قرارداد ایجاد نمی کند.";
        this.commitment4 = "طرف قرارداد مسئول حفظ و نگهداری وسایل و اموال در اختیار است و در صورت ایجاد خسارت ،دهیاری می تواند از محل قرارداد خسارت را جبران کند";
        this.signingNote = "امضای ذیل این قرارداد از سوی بخشدار صرفا جهت اجرای ماده ۱۶ اساسنامه ، تسهیلات و سازمان دهیاری ها مصوب ۱۳۸۰ و امضای مسئول امورمالی دهیاری دهیاری به استناد ماده ۱۱ آﺋین نامه استخدامی دهیاری های کشور می باشد دهیاری پاکل گراب به نمایندگی از دهیاری های بند ۲ این قرارداد به عنوان دهیاری کارفرما تعیین می گردد";
        this.finalNote = "این قرارداد در ۵ نسخه تنظیم و هر نسخه حکم واحد را دارد و پس از امضا و مهر و ثبت معتبر خواهد بود";
        this.executionDate = convertToPersianNumbers("۱۴۰۲/۰۱/۰۱");
        this.uniqueId = "پیش فرض";
        this.contractNumber = convertToPersianNumbers("۴۰۷ - ۱۴۰۲/۰۴/۲۶");
        this.contractorName = "کبری جوانمردی";
        this.employerName = "نعمت االله نوری";
        this.centralGovernor = "صفیه علی اولاد";
        this.sivanGovernor = "آزاد شریفی نژاد";
    }

    joinArray(arr) {
        return (arr && arr.length > 0) ? arr.join(' / ') : '';
    }

    calculateTotalSalary(salary) {
        return (salary?.base_salary || 0) +
            (salary?.history_benefits || 0) +
            (salary?.job_benefits || 0) +
            (salary?.child_benefits || 0) +
            (salary?.home_benefits || 0) +
            (salary?.food_benefits || 0) +
            (salary?.warzone_benefits || 0) +
            (salary?.supervisor_benefits || 0) +
            (salary?.married_benifits || 0);
    }
}

export default HumanResourceDTO;