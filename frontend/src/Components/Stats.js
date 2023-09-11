import { useState,useEffect } from "react";
import Slide from "react-reveal";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const Stats=()=>  {
  const [stats,setStats] = useState([]);
  
    const featureMessage = "Here you can view the stats of features used.";
    useEffect(()=>{
      const formData = new FormData();
      formData.append('function', 'stats');
      axios.post(process.env.REACT_APP_API_URL+'/stats/', formData)
      .then(response => {
        let updatedData = response.data['Statistics'].map((entry) => {
          if (entry.name === 'passport_photo_size') {
            return { ...entry, name: 'passport_photo' };
          }
          return entry;
        });

        updatedData = updatedData.map((entry) => {
          return { ...entry, count: entry.level };
        });

        setStats(updatedData);
      }
      )
      .catch(error => {console.log(error);});  
    },[])
    return (
      <section className="class1">
        <Slide left duration={1300}>
          <div className="row">
           <p>{featureMessage}</p>
<div style={{margin:'12rem 0rem 12rem 0rem'}}>
              <BarChart width={1500} height={300} data={stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
            </div>
          </div>
        </Slide>
      </section>
    );
  }

export default Stats;
