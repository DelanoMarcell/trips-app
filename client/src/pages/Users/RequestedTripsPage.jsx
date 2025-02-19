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
  Box
} from '@mui/material';

const RequestedTripsPage = () => {
  const [requestedTrips, setRequestedTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch requested trips
  useEffect(() => {
    const fetchRequestedTrips = async () => {
      try {
        const userID = 'user123';
        const response = await fetch(`http://localhost:5000/api/trips/requestedTrips?userID=${userID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch requested trips');
        }
        const data = await response.json();
        setRequestedTrips(data);
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
      const userID = 'user123'; // Replace with actual user ID
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
          requestedTrips.map((trip) => (
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
                        secondary={`${trip.cost}`} 
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
                              color: trip.status === 'accepted' ? 'green' : 
                                     trip.status === 'rejected' ? 'red' : 'orange'
                            }}
                          >
                            {trip.status}
                          </Typography>
                        } 
                      />
                    </ListItem>
                  </List>
                  {trip.status === 'pending' && (
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
          ))
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