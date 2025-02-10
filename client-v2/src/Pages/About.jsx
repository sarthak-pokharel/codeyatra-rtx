import React from "react";
import "./AboutUs.css";
import Navbar from "./Nav2";

const developers = [
  {
    name: "Sarthak Pokhrel  ",
    role: "FUll Stack Developer",
    experience:
      "Sarthak  has 6 years of experience in creating end-to-end web applications, excelling in both frontend and backend technologies.",
    image: "https://avatars.githubusercontent.com/u/54739445?v=4",
    portfolio: "https://github.com/sarthak-pokharel",
  },

  {
    name: "Sanandan Ghimire",
    role: "Full Stack Developer",
    experience:
      "Sanandan has 3 years of experience in creating end-to-end web applications, excelling in both frontend and backend technologies.",
    image: "/sanaq.jpg",
    portfolio: "https://sanandanghimire.com.np",
  },
  {
    name: "Raj Purush Aryal",
    role: "Research and Product mangament",
    experience: "",
    image: "/raj.jpg",
    portfolio: "https://www.portfolio.com",
  },
  {
    name: "Santu Magar",
    role: "UI Designer",
    experience: "",
    image: "/santu.jpg",
    portfolio: "https://www.portfolio.com",
  },
];

const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-us-container">
        <h1>About Us</h1>
        <p>
          Meet our talented team of developers who bring expertise and
          creativity to every project.
        </p>
        <div className="developer-cards">
          {developers.map((developer, index) => (
            <div className="developer-card" key={index}>
              <img
                src={developer.image}
                alt={developer.name}
                className="developer-image"
              />
              <h3>{developer.name}</h3>
              <h4>{developer.role}</h4>
              <p>{developer.experience}</p>
              <a
                href={developer.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-link"
              >
                View Portfolio
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default About;
