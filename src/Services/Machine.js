const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL


const getMachineBasicInformation = () => {
    return `${BaseUrl}/machine/basic-information`
}

const getMachineInformation = () => {
    return `${BaseUrl}/machine/machine-information`
}

export { getMachineBasicInformation, getMachineInformation }