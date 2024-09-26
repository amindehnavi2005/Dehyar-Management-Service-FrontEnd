export class MachineInformationDTO {
    constructor(machineInformationData) {
        this.id = machineInformationData.id || Date.now();
        this.category = machineInformationData.category || '';
        this.machineType = machineInformationData.machine_type || '';
        this.machineTitle = machineInformationData.machine_title || '';
        this.system = machineInformationData.system || '';
        this.engineNumber = machineInformationData.engine_number || '';
        this.manufacturingYear = machineInformationData.manufacturing_year || '';
        this.chassisNumber = machineInformationData.chassis_number || '';
        this.numberOfCylinders = machineInformationData.number_of_cylinders || '';
        this.capacity = machineInformationData.capacity || '';
        this.numberOfAxles = machineInformationData.number_of_axles || '';
        this.color = machineInformationData.color || '';
        this.fuel = machineInformationData.fuel || '';
        this.deliveryDate = machineInformationData.delivery_date || '';
        this.plateProvinceCode = machineInformationData.plate_province_code || '';
        this.plateCategoryLetter = machineInformationData.plate_category_letter || '';
        this.plateUniqeIdentifier = machineInformationData.plate_uniqe_identifier || '';
        this.plateRegistrationNumber = machineInformationData.plate_registration_number || '';
        this.machineCostFields = machineInformationData.machine_cost_fields || [{ funding_source: '', amount: '', description: '' }];
    }
}