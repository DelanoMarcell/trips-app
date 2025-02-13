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
  CircularProgress
} from '@mui/material';

const UserDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trips/tripsavailable');
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

  const handleJoinRequest = (trip) => {

    const userID = 'user123'; // Replace with actual user ID

    const requestJoinTrip = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/trips/tripRequest', {
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
      } catch (error) {
        console.error('Error:', error);
      }
    };

    requestJoinTrip();

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
      <Grid container spacing={3}>
        {trips.map((trip) => (
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
                      secondary={`$${trip.price}`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Seats Available" 
                      secondary={trip.seatsAvailable} 
                    />
                  </ListItem>
                </List>
                <Button 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  onClick={() => handleJoinRequest(trip)}
                >
                  Request to Join
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserDashboard;