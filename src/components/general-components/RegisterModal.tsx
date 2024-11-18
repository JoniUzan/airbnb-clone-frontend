import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/user.context";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function RegisterModal({ isOpen, onClose }: ModalProps) {
  const { register } = useAuth();

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string | null;
    const email = formData.get("email") as string | null;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    console.log(username, password, email, firstName, lastName);

    if (username && email && password && firstName && lastName) {
      try {
        await register({
          username,
          email,
          password,
          firstName,
          lastName,
        });
      } catch (error) {
        console.error("register failed:", error);
      }
    } else {
      console.error("Email and password are required.");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={handleOutsideClick}
      className={`font-montserrat fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100] transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg transform transition-all duration-500 ease-out">
        <div className="flex justify-between items-center border-b pb-2">
          <button
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
          ></button>
          <h3 className=" font-semibold">Sign up</h3>
          <div></div>
        </div>
        <form className="mt-4 space-y-2 mb-6" onSubmit={handleSubmit}>
          <p className="text-xl font-bold">Welcome to Airbnb</p>
          <p>Username:</p>
          <Input name="username" type="username" placeholder="Username" />
          <p>Password:</p>
          <Input name="password" type="password" placeholder="Password" />
          <p>Email:</p>
          <Input name="email" type="email" placeholder="Email" />
          <p>First Name:</p>
          <Input name="firstName" type="firstName" placeholder="First Name" />
          <p>Last Name:</p>
          <Input name="lastName" type="lastName" placeholder="Last Name" />
          <Button type="submit" variant="secondary">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
