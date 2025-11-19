import React from "react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuthData } from "../../providers/AuthProvider";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const RegisterComponent = () => {
  const {
    registerForm,
    setRegisterForm,
    showPassoword,
    setShowPassword,
    handleRegister,
    isLoading,
  } = useAuthData();

  const handleInputChange = (value, field) => {
    setRegisterForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center min-w-screen">
      <section className="p-4 border border-gray-500 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Register to Expense Manager</h2>

        <Input
          placeholder="Full Name"
          value={registerForm?.name}
          onChange={(e) => handleInputChange(e.target.value, "name")}
          className="mb-4"
        />

        <Input
          placeholder="Email"
          value={registerForm?.email}
          onChange={(e) => handleInputChange(e.target.value, "email")}
          className="mb-4"
        />

        <div className="relative mb-4">
          <Input
            placeholder="Password"
            type={showPassoword ? "text" : "password"}
            value={registerForm?.password}
            onChange={(e) => handleInputChange(e.target.value, "password")}
            className="pr-10"
          />

          <span
            onClick={() => setShowPassword(!showPassoword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
          >
            {showPassoword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <div className="flex justify-center items-center mt-2">
          <Button
            variant="outline"
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:text-white"
            onClick={handleRegister}
          >
            {isLoading ? (
              <>
                <Spinner className="size-6" />
              </>
            ) : (
              "Register"
            )}
          </Button>
        </div>
      </section>
    </section>
  );
};

export default RegisterComponent;
