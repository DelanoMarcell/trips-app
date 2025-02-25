import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom'; 


function About() {
    const navigate = useNavigate(); 

//comeng

    console.log("About running");
    async function getData() {
      const url = "http://localhost:5000/api/helloworld";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();
        console.log(json);
      } catch (error) {
        console.error(error.message);
      }
    }
    


    getData();


    return (
      <Fragment>

        <h1>Admin dashboard
          </h1>

      <button onClick={() => navigate('/home')}>Go to Home</button>

      </Fragment>

    );
  }

  export default About;