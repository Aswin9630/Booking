import { useAppContext } from "../context/AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as clientAPI from "../api-client";

const SignOut = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: clientAPI.SignOutAPI,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      showToast({ message: "Logout Success", type: "SUCCESS" });
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
      className="py-0.5 px-1 md:px-6 md:py-2 text-xs md:text-md text-center rounded-2xl md:rounded-full text-white hover:text-gray-300 font-semibold bg-black cursor-pointer"
    >
      Logout
    </button>
  );
};

export default SignOut;
