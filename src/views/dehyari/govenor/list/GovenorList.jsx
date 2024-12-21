// MUI Imports
"use client";
import Grid from "@mui/material/Grid";

// Component Imports
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "@utils/axiosInstance";
import { me } from "@/Services/Auth/AuthService";
import GovenorCards from "@views/dehyari/govenor/list/GovenorCards";
import GovenorListTable from "@views/dehyari/govenor/list/GovenorListTable";
import CreateGovenorSidebar from "@views/dehyari/govenor/create/CreateGovenorSidebar";

const GovenorList = ({ userData }) => {
  const [calendarApi, setCalendarApi] = useState(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [sidebarDetails, setSidebarDetails] = useState({
    status: "add",
    defaultValues: {},
  });
  const [loading, setLoading] = useState(false);
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false);
  const calendarStore = useSelector((state) => state.calendarReducer);
  const [userGeoState, setUserGeoState] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await api.get(`${me()}`, { requiresAuth: true });
      setUserGeoState(response.data.data.user.original.geo_state);
    };
    fetchUserData();
  }, []);

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen);
  const handleAddEventSidebarToggle = () =>
    setAddEventSidebarOpen(!addEventSidebarOpen);
  const dispatch = useDispatch();
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <GovenorCards
          loading={loading}
          setLoading={setLoading}
          userGeoState={userGeoState}
        />
      </Grid>
      <Grid item xs={12}>
        <GovenorListTable
          tableData={userData}
          dispatch={dispatch}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          addEventSidebarOpen={addEventSidebarOpen}
          setSidebarDetails={setSidebarDetails}
          loading={loading}
          setLoading={setLoading}
          userGeoState={userGeoState}
        />
        <CreateGovenorSidebar
          dispatch={dispatch}
          calendarApi={calendarApi}
          calendarStore={calendarStore}
          addEventSidebarOpen={addEventSidebarOpen}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          sidebarDetails={sidebarDetails}
          setSidebarDetails={setSidebarDetails}
          setLoading={setLoading}
          userGeoState={userGeoState}
        />
      </Grid>
    </Grid>
  );
};

export default GovenorList;
