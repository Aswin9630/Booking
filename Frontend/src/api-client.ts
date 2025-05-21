import type { SignInFormData } from "./components/SignIn";
import type { RegisterFormData } from "./components/SignUp"
import type {  HotelType } from "../../Backend/src/model/hotelModel"
const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL

export const registerAPI = async(FormData:RegisterFormData)=>{
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include", 
        body:JSON.stringify(FormData)
    })

    const responseBody = await response.json();
    if(!response.ok){ 
        throw new Error(responseBody.message)
    }
}

export const signInAPI = async(FormData:SignInFormData)=>{
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type" :"application/json"
        },
        body:JSON.stringify(FormData)
    })
    const responseBody = await response.json();
     if(!response.ok){
        throw new Error(responseBody.message)
    }

    return responseBody;

}

export const SignOutAPI = async ()=>{
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
        method:"POST",
        credentials:"include"
    })

    if(!response.ok){
        throw new Error("Logout failed")
    }
}


export const addMyHotel =async (hotelFormData:FormData)=>{
    const response = await fetch(`${BACKEND_URL}/api/my-hotels`, {
        method:"POST",
        credentials:"include",
        body:hotelFormData
    })
    if(!response.ok){
        throw new Error("Fail to add Hotel")
    }
    return response.json();
}

export async function viewHotel(): Promise<HotelType[]> {
    const response = await fetch(`${BACKEND_URL}/api/my-hotels`, {
        credentials: "include"
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }

    return responseBody.hotels;
}

export const fetchMyHotelsById = async (hotelId:string) : Promise<HotelType>=>{
    const response = await fetch(`${BACKEND_URL}/api/my-hotels/${hotelId}`, {
        credentials:"include",
        method:"GET"
    })
    const responseBody = await response.json();
    if(!response.ok){
        throw new Error(responseBody.message)
    }

    return responseBody;
}


export const updateMyHotelById = async(hotelFormData:FormData)=>{
    const response = await fetch(`${BACKEND_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        method:"PUT",
        body:hotelFormData,
        credentials:"include"
    });
    const responseBody = await response.json();
    if(!response.ok){
        throw new Error("Failed to Update Hotel")
    }

    return responseBody;
}

export const validateToken = async ()=>{
    const response = await fetch(`${BACKEND_URL}/auth/verifyToken`, {
        credentials:"include"
    })

    if(!response.ok){
        throw new Error("Token Invalid")
    }

    return response.json()
} 