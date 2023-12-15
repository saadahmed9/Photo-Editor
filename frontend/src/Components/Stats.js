import { useState,useEffect } from "react";
import Slide from "react-reveal";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const Stats=()=>  {
  const [stats,setStats] = useState([]);
  
    const featureMessage = "Stats of most frequently used features";
    const colorArray = ["#d8ac29", "#4caf50", "#2196f3", "#f44336", "#ff9800", "#9c27b0"];
    useEffect(() => {
      const fetchData = async (url, nameTransformation) => {
        try {
          const formData = new FormData();
          formData.append('function', 'stats');
    
          const response = await axios.post(url, formData);
    
          let updatedData = response.data['Statistics'].map((entry) => {
            // Apply any transformations based on the name
            return nameTransformation(entry);
          });
    
          updatedData = updatedData.map((entry) => {
            // Apply the entry.name condition
            if (entry.name === 'passport_photo_size') {
              return { ...entry, name: 'Passport Photo' };
            } else if (entry.name === 'background_change') {
              return { ...entry, name: 'BG Removal' };
            }
            else if (entry.name === 'format_change') {
              return { ...entry, name: 'Format Change' };
            }
            else if (entry.name === 'resize') {
              return { ...entry, name: 'Resize' };
            }
            else if (entry.name === 'mosaic_maker') {
              return { ...entry, name: 'Mosiac' };
            }
            else if (entry.name === 'image_compression') {
              return { ...entry, name: 'Image Compression' };
            }
            else if (entry.name === 'video_compression') {
              return { ...entry, name: 'Video Compression' };
            }
            return entry;
          });
    
          updatedData = updatedData.map((entry) => {
            return { ...entry, count: entry.level };
          });
    
          return updatedData;
        } catch (error) {
          console.error(`Error fetching stats from ${url}:`, error);
          return [];
        }
      };
    
      // Define your URLs and name transformations for each stats request
      const statsRequests = [
        { url: 'http://xlabk8s3.cse.buffalo.edu:30010/stats-passport/', nameTransformation: (entry) => entry },
        { url: 'http://xlabk8s3.cse.buffalo.edu:30015/stats-bg/', nameTransformation: (entry) => entry },
        { url: 'http://xlabk8s3.cse.buffalo.edu:30014/stats-format-change/', nameTransformation: (entry) => entry },
        { url: 'http://xlabk8s3.cse.buffalo.edu:30016/stats-mosaic/', nameTransformation: (entry) => entry },
        { url: 'http://xlabk8s3.cse.buffalo.edu:30017/stats-image/', nameTransformation: (entry) => entry },
        { url: 'http://xlabk8s3.cse.buffalo.edu:30018/stats-video/', nameTransformation: (entry) => entry },
        
        // Add more requests as needed
      ];
    
      // Perform all requests sequentially and update the state
      const fetchDataForAll = async () => {
        let combinedStats = [];
    
        for (const request of statsRequests) {
          const statsData = await fetchData(request.url, request.nameTransformation);
          combinedStats = [...combinedStats, ...statsData];
        }
    
        setStats(combinedStats);
      };
    
      fetchDataForAll();
    }, []);
    return (
      <section className="class-stats" >
        <Slide left duration={1300}>
          <div className="row">
           
<div style={{margin:'12rem 0rem 12rem 0rem'}}>
<p style={{ textAlign: "center",fontSize: "30px",fontWeight: "bold"}}>{featureMessage}</p>
              <BarChart width={1100} height={300} data={stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#EC974C " />
      </BarChart>
            </div>
          </div>
        </Slide>
      </section>
    );
  }

export default Stats;
