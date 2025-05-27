import { useAppContext } from "../context/AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as clientAPI from "../api-client";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: clientAPI.SignOutAPI,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      showToast({ message: "Logout Success", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "FAILURE" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="py-2 px-1 md:px-6 md:py-2 text-xs md:text-md text-center rounded-md text-white hover:text-gray-300 font-semibold bg-black cursor-pointer"
    >
      Logout
    </button>
  );
};

export default SignOut;
