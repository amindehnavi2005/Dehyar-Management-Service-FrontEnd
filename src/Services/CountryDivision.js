const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL


const getCity = () => {
    return `${BaseUrl}/country_division/city`
}


export {getCity}