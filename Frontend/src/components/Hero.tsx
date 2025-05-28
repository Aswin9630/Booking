import { useEffect, useState } from "react";
import heroImg1 from "../assets/heroImg1.jpg"
import heroImg2 from "../assets/heroImg2.jpg"
import heroImg3 from "../assets/heroImg3.jpg"
import heroImg4 from "../assets/heroImg4.jpg"
import heroImg5 from "../assets/heroImg5.jpg"

const Hero = () => {

  const images = [heroImg1,heroImg2,heroImg3,heroImg4,heroImg5]

  const [active,setActive] = useState(0);

  useEffect(()=>{
    const timer = setInterval(()=>{
      loadNextImage()
    },5000);
     return ()=>clearInterval(timer);
  },[]);


  const loadNextImage = ()=>{
    setActive((prev) => (prev+1) % images.length)
  }

  return (
  <div className="p-5">
    <div className= "p-3 md:p-10 bg-cover bg-center bg-no-repeat h-50 md:h-100 rounded-xl md:bg-cover md:bg-no-repeat w-full md:bg-center" style={{backgroundImage:`url(${images[active]})`}}>
         <h1 className="font-bold text-slate-100 text-3xl md:text-6xl text-center text-shadow-slate-900 text-shadow-lg">
        Find Your Perfect Stay
      </h1>
    </div>
  </div>
  );
};

export default Hero;
