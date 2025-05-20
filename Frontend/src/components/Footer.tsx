import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className="bg-slate-100 py-5 ">
      <div className="flex justify-between gap-5 md:gap-0 px-5 mx-auto">
         <span className="font-extrabold font-serif text-xl md:text-2xl">
                <Link to='/'>NextStay.com</Link>
          </span>
          <span className="flex flex-col gap-1 font-serif text-sm text-gray-600">
            <p><Link to='/'>Careers</Link></p>
            <p><Link to='/'>Privacy policy</Link></p>
            <p><Link to='/'>Terms Of Services</Link></p>
          </span>
      </div>
    </div>
  )
}

export default Footer