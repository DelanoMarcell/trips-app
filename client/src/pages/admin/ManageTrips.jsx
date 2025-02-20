import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Grid,
  Box
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import SideNav from '../../components/admin_only/Sidebar';
import styles from './ManageTrips.module.css';
import Cookies from 'js-cookie';

const TripsManagement = () => {
  const [trips, setTrips] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const adminKey = Cookies.get('email');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/trips/tripsavailable?admin=${adminKey}`
        );
        if (!response.ok) throw new Error('Failed to fetch trips');
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleEditClick = (trip) => {
    setEditingId(trip._id);
    setEditValues({ 
      from: trip.from,
      to: trip.to,
      departure: trip.departure,
      cost: trip.cost,
      seatsAvailable: trip.seatsAvailable
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditValues({});
  };

  
  const handleSaveClick = async () => {
    if (!editingId) return;
  
    try {
      const adminKey = Cookies.get('adminKey');
      const response = await fetch(`http://localhost:5000/api/trips/updatetrips/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: editValues.from,
          to: editValues.to,
          departure: editValues.departure,
          cost: editValues.cost,
          seatsAvailable: editValues.seatsAvailable
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }
  
      const updatedTrip = await response.json();
      
      setTrips(trips.map(trip => 
        trip._id === editingId ? { ...trip, ...updatedTrip } : trip
      ));
      
      setEditingId(null);
      setEditValues({});
      setError('');
    } catch (error) {
      console.error('Error updating trip:', error);
      setError(error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div className={styles.mainContainer}>
      <SideNav />
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Manage Trips
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Departure Time</TableCell>
                  <TableCell>Price (R)</TableCell>
                  <TableCell>Seats Available</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip._id}>
                    <TableCell>
                      {editingId === trip._id ? (
                        <TextField
                          value={editValues.from || ''}
                          onChange={(e) => handleInputChange('from', e.target.value)}
                        />
                      ) : (
                        trip.from
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === trip._id ? (
                        <TextField
                          value={editValues.to || ''}
                          onChange={(e) => handleInputChange('to', e.target.value)}
                        />
                      ) : (
                        trip.to
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === trip._id ? (
                        <TextField
                          type="datetime-local"
                          value={editValues.departure?.slice(0, 16) || ''}
                          onChange={(e) => handleInputChange('departure', e.target.value)}
                        />
                      ) : (
                        new Date(trip.departure).toLocaleString()
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === trip._id ? (
                        <TextField
                          type="number"
                          value={editValues.cost || 0}
                          onChange={(e) => handleInputChange('cost', Number(e.target.value))}
                        />
                      ) : (
                        `R${trip.cost}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === trip._id ? (
                        <TextField
                          type="number"
                          value={editValues.seatsAvailable || 0}
                          onChange={(e) => handleInputChange('seatsAvailable', Number(e.target.value))}
                        />
                      ) : (
                        trip.seatsAvailable
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === trip._id ? (
                        <Grid container spacing={1}>
                          <Grid item>
                            <IconButton color="primary" onClick={handleSaveClick}>
                              <SaveIcon />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <IconButton color="secondary" onClick={handleCancelClick}>
                              <CancelIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ) : (
                        <IconButton color="primary" onClick={() => handleEditClick(trip)}>
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </div>
  );
};

export default TripsManagement;