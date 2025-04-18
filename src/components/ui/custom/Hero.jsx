import React from 'react'
import { Button } from "../Button"
import { Link } from "react-router-dom"

function Hero () {
  return (
    <div className = "flex flex-col item-center mx-56 gap-9">
      <h1
      className = "font-extrabold text-[50px] text-center mt-16">
        <span className = "text-[#f56655] ">Discover Your Next Adventure with AI:</span> Personalized Itineraries at Your Fingertips</h1>
     <p className="text-xl text-grey-500 text-center">our personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p>
    
    <Link to={"/create-trip"}>
    <Button> Get Strated, It's Free </Button>
    </Link>
    </div>
  );
};

export default Hero
