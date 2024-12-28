import axios from "axios";
import { useEffect, useState } from "react"


export const AppBar = () => {
    const [name, setName] = useState("");
    const [showSignOut, setShowSignOut] = useState(false);

    useEffect(()=>{
        axios
        .get("http://localhost:3000/api/v1/user/profile", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => setName(response.data.firstName))
        
    }, [])

    const handleSignOut = () => {
        localStorage.removeItem("token"); // Remove token
        window.location.href = "/signin"; // Redirect to login page
      };


  return (
    <div className="flex justify-between h-14 shadow">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
        </div>
        <div className="flex relative">
            <div className="flex flex-col justify-center h-full mr-4">Hello, {name}</div>
            <div className="rounded-full h-12 w-12 bg-slate-200 cursor-pointer flex justify-center mt-1 mr-2"
            onClick={() => setShowSignOut((prev) => !prev)}>
                <div className="flex flex-col justify-center h-full text-xl">
                    {name ? name[0].toUpperCase() : "U"}
                </div>
                {showSignOut && (
                    <div
                    className="absolute top-14 right-0 bg-white shadow-md rounded-md p-2 z-10"
                    >
                    <button
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}
