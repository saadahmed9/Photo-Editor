import React from 'react';
import './about.css'
import Stats from './Components/Stats';
const About = () => {
    return (
        <div className="about-section">
            <h1>Our Team</h1>
            <div className="team-members">

                {/* Member 1 */}
                <div className="member">
                    <img src="/About/pavana.jpeg" alt="Pavana Lakshmi Venugopal" />
                    <h2>Pavana Lakshmi Venugopal</h2>
                    <p className="role">Graduate Student</p>
                    <p className="department">Computer Science Engineering</p>
                    <p className="email">Email: pavanala@buffalo.edu</p>
                </div>

                {/* Member 2 */}
                <div className="member">
                    <img src="/About/saad.jpeg" alt="Saad Ahmed" />
                    <h2>Saad Ahmed</h2>
                    <p className="role">Graduate Student</p>
                    <p className="department">Computer Science Engineering</p>
                    <p className="email">Email: saadahm2@buffalo.edu</p>
                </div>

                {/* Member 3 */}
                <div className="member">
                    <img src="/About/Rohit.jpg" alt="Taraka Rohit Adusumilli" />
                    <h2>Taraka Rohit Adusumilli</h2>
                    <p className="role">Graduate Student</p>
                    <p className="department">Computer Science Engineering</p>
                    <p className="email">Email: tarakaro@buffalo.edu</p>
                </div>

                {/* Member 4 */}
                <div className="member">
                    <img src="/About/ayesha.jpeg" alt="Ayesha Humaera" />
                    <h2>Ayesha Humaera</h2>
                    <p className="role">Graduate Student</p>
                    <p className="department">Computer Science Engineering</p>
                    <p className="email">Email: ayeshahu@buffalo.edu</p>
                </div>
            </div>

            <h1 className="mentor-heading">Mentors</h1>
            <div className="mentors">

                {/* Mentor 1 */}
                <div className="mentor">
                    <img src="/About/Jinjun.jpg" alt="Jinjun Xiong" />
                    <h2>Jinjun Xiong</h2>
                    <p className="role">Professor</p>
                    <p className="email">Email: jinjun@buffalo.edu</p>
                </div>

                {/* Mentor 2 */}
                <div className="mentor">
                    <img src="/About/Yuting.jpeg" alt="Yuting Hu" />
                    <h2>Yuting Hu</h2>
                    <p className="role">Teaching Assistant</p>
                    <p className="email">Email: yhu54@buffalo.edu</p>
                </div>

            </div>
            <br></br>
            <Stats/>
        </div>
        
    );
};

export default About;
