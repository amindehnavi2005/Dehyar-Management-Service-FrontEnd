const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL


const getMachineBasicInformation = () => {
    return `${BaseUrl}/machine/basic-information`
}

export { getMachineBasicInformation }