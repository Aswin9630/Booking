import { useEffect, useState } from "react";

const Hero = () => {

  const images = [
    "https://www.a3qube.com/ex-image/HD-918-BEDROOM.jpg",
    "https://homeydesign.com/wp-content/uploads/HD-901-BEDROOM.jpg",
    "https://img.freepik.com/premium-photo/beautiful-evening-hotel-arabic-egypt-sharm-el-sheikh_121943-1393.jpg",
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/e9/24/c0/steigenberger-aqua-magic.jpg?w=1200&h=-1&s=1"
  ]

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
