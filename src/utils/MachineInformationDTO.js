export class MachineInformationDTO {
    constructor(machineInformationData) {
        this.id = machineInformationData.id || Date.now();
        this.category = machineInformationData.category || '';
        this.machineType = machineInformationData.machine_type || '';
        this.machineTitle = machineInformationData.machine_title || '';
        this.system = machineInformationData.system == 0 && 'ساده' || machineInformationData.system == 1 && 'جک دار' || '';
        this.engineNumber = machineInformationData.engine_number || '';
        this.manufacturingYear = machineInformationData.manufacturing_year || '';
        this.chassisNumber = machineInformationData.chassis_number || '';
        this.numberCylinders = machineInformationData.number_cylinders || '';
        this.capacity = machineInformationData.capacity || '';
        this.numberAxles = machineInformationData.number_axles || '';
        this.color = machineInformationData.color || '';
        this.fuel = machineInformationData.fuel == 0 && 'بنزینی' || machineInformationData.fuel == 1 && 'گازوئیلی' || machineInformationData.fuel == 2 && 'ترکیبی' || '';
        this.deliveryDate = machineInformationData.delivery_date || '';
        this.plateProvinceCode = machineInformationData.plate_province_code || '';
        this.plateCategoryLetter = machineInformationData.plate_category_letter || '';
        this.plateUniqeIdentifier = machineInformationData.plate_uniqe_identifier || '';
        this.plateRegistrationNumber = machineInformationData.plate_registration_number || '';
        this.machineCostFields = (machineInformationData.machine_cost_fields || [{ funding_source: '', amount: '', description: '' }])
            .map(field => ({
                ...field,
                funding_source: field.funding_source === 0 ? 'منابع داخلی' :
                    field.funding_source === 1 ? 'کمک های دولتی' :
                        '',
                amount: Number(field.amount).toLocaleString('en-US')
            }));
    }
}