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
} from '@mui/material';
import Cookies from 'js-cookie';

const RequestedTripsPage = () => {
  const [requestedTrips, setRequestedTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userEmail = Cookies.get('email');

  // Fetch requested trips when the component mounts
  useEffect(() => {
    const fetchRequestedTrips = async () => {
      try {
        const userID = Cookies.get("email");
        const response = await fetch(`http://localhost:5000/api/trips/requestedTrips?userID=${userID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch requested trips');
        }
        const data = await response.json();
        setRequestedTrips(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestedTrips();
  }, []);

  // Handle cancel request
  const handleCancelRequest = async (tripID) => {
    try {
      const userID = Cookies.get('email'); // Use the actual user email
      const response = await fetch('http://localhost:5000/api/trips/cancelRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, tripID }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel trip request');
      }

      // Remove the canceled trip from the list
      setRequestedTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripID));
      console.log('Trip request canceled successfully');
    } catch (error) {
      console.error('Error:', error);
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
      <Typography variant="h4" gutterBottom>
        Requested Trips
      </Typography>
      <Grid container spacing={3}>
        {requestedTrips.length > 0 ? (
          requestedTrips.map((trip) => {
            // Determine the status dynamically:
            // 1. If the user's email is in acceptedRequest, status is "accepted"
            // 2. Else if it's in rejectedRequest, status is "rejected"
            // 3. Otherwise, default to the status from the trip data (or "pending")
            const updatedStatus = trip.acceptedRequest.includes(userEmail)
              ? "accepted"
              : trip.rejectedRequest && trip.rejectedRequest.includes(userEmail)
              ? "rejected"
              : (trip.status && trip.status[0] ? trip.status[0].toLowerCase() : "pending");

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
                          primary="Departure" 
                          secondary={new Date(trip.departure).toLocaleString()} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Status" 
                          secondary={
                            <Typography 
                              style={{
                                color: updatedStatus === 'accepted'
                                  ? 'green'
                                  : updatedStatus === 'rejected'
                                  ? 'red'
                                  : 'orange'
                              }}
                            >
                              {updatedStatus}
                            </Typography>
                          } 
                        />
                      </ListItem>
                    </List>
                    {updatedStatus === 'pending' && (
                      <Button 
                        variant="contained" 
                        color="secondary"
                        fullWidth
                        onClick={() => handleCancelRequest(trip._id)}
                      >
                        Cancel Request
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography variant="body1" sx={{ mt: 3 }}>
            You haven't requested to join any trips yet.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default RequestedTripsPage;
