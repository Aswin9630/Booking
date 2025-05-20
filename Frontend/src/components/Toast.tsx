import { useEffect } from "react";

type ToastProp = {
  message: string;
  type: "SUCCESS" | "FAILURE";
  onClose:()=>void;
};

const Toast = ({ message, type, onClose }: ToastProp) => {

    useEffect(()=>{
        const timer = setTimeout(()=>{
            onClose()
        },5000);
        return ()=>{
            clearTimeout(timer);
        }
    },[onClose])

  const styles = type === "SUCCESS"
      ? "bg-green-600 text-white max-w-md top-4 right-4 p-4 z-50 rounded-md fixed "
      : "bg-red-600 text-white max-w-md top-4 right-4 p-4 z-50 rounded-md fixed";


  return (
    <div className={styles}>
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
