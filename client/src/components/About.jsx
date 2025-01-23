import { useNavigate } from 'react-router-dom'; // Import useNavigate


function About() {
    const navigate = useNavigate(); // useNavigate hook for programmatic navigation
    return (
      <button onClick={() => navigate('/')}>Go to Home</button>
    );
  }

  export default About;