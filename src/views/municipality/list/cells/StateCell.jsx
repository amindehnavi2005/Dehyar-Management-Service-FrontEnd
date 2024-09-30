import { getGeoData, getState } from '@/Services/DataService';
import api from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react'

const StateCell = ({ state }) => {
    const [currentState, setCurrentState] = useState('');

    console.log("State => ", state);

    useEffect(() => {
        if (state !== null) {
            const fetchData = async () => {
                try {
                    const stateResponse = await api.get(`${getState()}`, { requiresAuth: true });
                    setCurrentState(stateResponse?.data?.data?.map(newState => {
                        return newState.hierarchy_code == state ? newState.approved_name : null
                    }));
                    console.log("Current State =>", currentState);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [state]);

    return (
        <div style={{ textAlign: 'right' }}>{currentState || ''}</div>
    );

}

export default StateCell