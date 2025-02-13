import SideNav from "../../components/admin_only/Sidebar";
import './TripRequest.module.css';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';

function TripRequest() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/trips/tripRequestadm')
            .then(response => response.json())
            .then(data => setRequests(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleAccept = (id) => {
        // Handle accept logic here
        console.log('Accepted request with id:', id);
    };

    const handleReject = (id) => {
        // Handle reject logic here
        console.log('Rejected request with id:', id);
    };

    return (
        <div className='pageContainr'>
            <SideNav />
            <div className='mainContent'>
                {requests.map(request => (
                    <div key={request.id} className='requestItem'>
                        <FaUser />
                        <span>{request.name} - {request.email}</span>
                        <button onClick={() => handleAccept(request.id)}>Accept</button>
                        <button onClick={() => handleReject(request.id)}>Reject</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TripRequest;
