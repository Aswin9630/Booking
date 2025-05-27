import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as clientAPI from "../api-client";
import { useAppContext } from "../context/AppContext";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation()
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: clientAPI.signInAPI,
    onSuccess: async () => {
      showToast({ message: "Login Success", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      await queryClient.refetchQueries({ queryKey: ["validateToken"] });
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: any) => {
      showToast({ message: error.message, type: "FAILURE" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="container flex flex-col gap-3 mx-auto p-5"
    >
      <h2 className="text-3xl font-bold text-center">Sign In</h2>
      <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
        Email
        <input
          className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
          type="email"
          {...register("email", {
            required: "Email is Required",
          })}
        />
        {errors.email && (
          <span className="text-red-600 text-sm font-normal">
            {errors.email.message}
          </span>
        )}
      </label>
      <label className="flex flex-col text-sm font-bold text-gray-800 flex-1">
        Password
        <input
          className="border rounded outline-none border-gray-500 w-full font-normal px-2 py-1"
          type="password"
          {...register("password", {
            required: "Password is Required",
            minLength: {
              value: 6,
              message: "Password must be atleast 6 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
              message:
                "Password must include uppercase, lowercase, number, and special character",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-600 text-sm font-normal">
            {errors.password.message}
          </span>
        )}
      </label>
      <span className="flex justify-between">
        <p className="text-black font-normal">
          New User?{" "}
          <span className="font-semibold underline cursor-pointer">
            <Link to="/sign-up">Register</Link>
          </span>
        </p>
        <button
          type="submit"
          className="py-2 px-2 md:px-6 text-xs md:text-md text-center rounded-2xl md:rounded-full text-white hover:text-gray-300 font-semibold bg-black cursor-pointer"
        >
          Sign In
        </button>
      </span>
    </form>
  );
};

export default SignIn;
