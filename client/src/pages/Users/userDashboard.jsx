import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText,
  Button,
  CircularProgress,
  TextField,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import RequestedTripsPage from './RequestedTripsPage';
import Cookies from 'js-cookie';

const UserDashboard = () => {
  const userEmail = Cookies.get('email');
  const [trips, setTrips] = useState([]); // All trips
  const [appliedTrips, setAppliedTrips] = useState([]); // Trips applied for (fetched from backend)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [tabValue, setTabValue] = useState(0); // Tabs for All Trips and Applied Trips

  // Fetch all trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/trips/getalltrips');
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Fetch applied trips for the user from backend (if you need additional data)
  const fetchAppliedTrips = async () => {
    try {
      const userID = userEmail;
      const response = await fetch(`/api/trips/appliedTrips?userID=${userID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch applied trips');
      }
      const data = await response.json();
      setAppliedTrips(data);
    } catch (error) {
      console.error('Error fetching applied trips:', error);
    }
  };

  // Fetch applied trips on mount so we know which trips the user has applied for
  useEffect(() => {
    fetchAppliedTrips();
  }, []);

  // Handle join request
  const handleJoinRequest = async (trip) => {
    const userID = userEmail;

    try {
      const response = await fetch('/api/trips/tripRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, tripID: trip._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to request to join trip');
      }

      const data = await response.json();
      console.log('Request successful:', data);
      fetchAppliedTrips(); // Refresh applied trips after joining
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Filter trips based on search query
  const filteredTrips = trips.filter((trip) =>
    trip.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      fetchAppliedTrips(); // Fetch applied trips when switching tabs
    }
  };

  if (isLoading) {
    return (
      <Container style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container style={{ minHeight: '100vh', paddingTop: '24px', paddingBottom: '24px' }}>
      {/* Tabs for All Trips and Applied Trips */}
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="All Trips" />
        <Tab label="Applied Trips" />
      </Tabs>

      {/* Search Bar (Only for All Trips tab) */}
      {tabValue === 0 && (
        <Box sx={{ my: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by origin, or destination"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      )}

      {/* Display Trips */}
      <Grid container spacing={3}>
        {tabValue === 0 ? (
          // All Trips
          filteredTrips.map((trip) => {
            // Check if the user's email is in requestToJoin, acceptedRequest, or rejectedRequest arrays.
            const alreadyApplied = trip.requestToJoin.includes(userEmail) ||
                                   trip.acceptedRequest.includes(userEmail) ||
                                   (trip.rejectedRequest && trip.rejectedRequest.includes(userEmail));
            return (
              <Grid item xs={12} sm={6} md={4} key={trip._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {trip.from} to {trip.to}
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Price" 
                          secondary={`R${trip.cost}`} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Seats Available" 
                          secondary={trip.seatsAvailable} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Departure" 
                          secondary={new Date(trip.departure).toLocaleString()} 
                        />
                      </ListItem>
                    </List>
                    {alreadyApplied ? (
                      <Button 
                        variant="contained" 
                        color="secondary"
                        fullWidth
                        disabled
                      >
                        Already Applied
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="primary"
                        fullWidth
                        onClick={() => handleJoinRequest(trip)}
                      >
                        Request to Join
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          // Applied Trips
          appliedTrips.length > 0 ? (
            appliedTrips.map((trip) => (
              <Grid item xs={12} sm={6} md={4} key={trip._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {trip.from} to {trip.to}
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Price" 
                          secondary={`R${trip.cost}`} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Departure" 
                          secondary={new Date(trip.departure).toLocaleString()} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 3 }}>
              <RequestedTripsPage/>
            </Typography>
          )
        )}
      </Grid>
    </Container>
  );
};

export default UserDashboard;
