import { useNavigate } from 'react-router-dom'; // Import useNavigate



function Home() {
    const navigate = useNavigate(); // useNavigate hook for programmatic navigation


   

    return (
   
        
<button onClick={() => navigate('/about')}>Go to About</button>
   
      
    );

  }
  

export default Home;