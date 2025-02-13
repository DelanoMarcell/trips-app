import { useState } from 'react';
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
  Button,
  IconButton,
  Grid,
  Box
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import SideNav from '../../components/admin_only/Sidebar';
import styles from './ManageTrips.module.css';

const initialTrips = [
  {
    id: '1',
    from: 'qwaqwa',
    to: 'Johannesburg',
    departureTime: '2024-03-20T08:00',
    price: 50,
    seatsAvailable: 24
  },

];

const TripsManagement = () => {
  const [trips, setTrips] = useState(initialTrips);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleEditClick = (trip) => {
    setEditingId(trip.id);
    setEditValues({ ...trip });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSaveClick = () => {
    if (editingId) {
      setTrips(trips.map(trip => 
        trip.id === editingId ? { ...trip, ...editValues } : trip
      ));

      console.log(trips);
      setEditingId(null);
      setEditValues({});
    }
  };

  const handleInputChange = (field, value) => {
    console.log("field ",field);
    console.log("value ",value);

    setEditValues(prev => ({ ...prev, [field]: value }));
  };

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
                <TableRow key={trip.id}>
                  <TableCell>
                    {editingId === trip.id ? (
                      <TextField
                        value={editValues.from || ''}
                        onChange={(e) => handleInputChange('from', e.target.value)}
                      />
                    ) : (
                      trip.from
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === trip.id ? (
                      <TextField
                        value={editValues.to || ''}
                        onChange={(e) => handleInputChange('to', e.target.value)}
                      />
                    ) : (
                      trip.to
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === trip.id ? (
                      <TextField
                        type="datetime-local"
                        value={editValues.departureTime || ''}
                        onChange={(e) => handleInputChange('departureTime', e.target.value)}
                      />
                    ) : (
                      new Date(trip.departureTime).toLocaleString()
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === trip.id ? (
                      <TextField
                        type="number"
                        value={editValues.price || 0}
                        onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      />
                    ) : (
                      `R${trip.price}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === trip.id ? (
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
                    {editingId === trip.id ? (
                      <Grid container spacing={1}>
                        <Grid item>
                          <IconButton
                            color="primary"
                            onClick={handleSaveClick}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            color="secondary"
                            onClick={handleCancelClick}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(trip)}
                      >
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