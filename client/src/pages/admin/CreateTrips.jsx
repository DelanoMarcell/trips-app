import React, { useState } from 'react'; 
import { FiMapPin, FiClock, FiDollarSign, FiPlusCircle } from 'react-icons/fi';
import styles from './CreateTrip.module.css';
import SideNav from '../../components/admin_only/Sidebar';

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    tripName: '',
    from: '',
    to: '',
    departure: '',
    cost: '',
    seatsAvailable: '', // Added state for seats available
    notes: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here
    console.log('Trip created:', formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData({
      tripName: '',
      from: '',
      to: '',
      departure: '',
      cost: '',
      seatsAvailable: '', // Reset seats available
      notes: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className='pageContainr'>
      <SideNav/>

      <div className={styles.createTripContainer}>
        <div className={styles.formWrapper}>
          <h1 className={styles.header}>
            <FiPlusCircle className={styles.headerIcon} />
            Create New Trip
          </h1>

          <form onSubmit={handleSubmit} className={styles.tripForm}>
            <div className={styles.locationGroup}>
              <div className={styles.formGroup}>
                <label htmlFor="from"><FiMapPin /> From</label>
                <input
                  type="text"
                  id="from"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="to"><FiMapPin /> To</label>
                <input
                  type="text"
                  id="to"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.timeCostGroup}>
              <div className={styles.formGroup}>
                <label htmlFor="departure"><FiClock /> Departure Date & Time</label>
                <input
                  type="datetime-local"
                  id="departure"
                  name="departure"
                  value={formData.departure}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cost"> Cost</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* New Seats Available Section */}
            <div className={styles.formGroup}>
              <label htmlFor="seatsAvailable">Number of Seats Available</label>
              <input
                type="number"
                id="seatsAvailable"
                name="seatsAvailable"
                min="1"
                value={formData.seatsAvailable}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Create Trip
            </button>

            {showSuccess && (
              <div className={styles.successMessage}>
                Trip created successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
    