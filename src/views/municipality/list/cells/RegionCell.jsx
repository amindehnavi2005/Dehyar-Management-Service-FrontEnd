import { getGeoData } from '@/Services/DataService';
import api from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react'

const RegionCell = ({ region }) => {
    const [currentRegion, setCurrentRegion] = useState('');

    useEffect(() => {
        console.log("State => ", region);

        const fetchData = async () => {
            try {
                const regionResponse = await api.get(`${getGeoData()}?level=region&hierarchy_code=${region}`, { requiresAuth: true });
                console.log("Regions => ", regionResponse);

                setCurrentRegion(regionResponse?.data[0]?.approved_name || '');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [region]);

    return (
        <div style={{ textAlign: 'right' }}>{region !== null ? currentRegion ? currentRegion : <span className='animate-pulse'>در حال بارگذاری</span> : ''}</div>
    );

}

export default RegionCell