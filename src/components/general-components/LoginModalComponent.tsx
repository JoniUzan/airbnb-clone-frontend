import { X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "@/providers/user.context";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { login, handleGoogleSuccess } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 100); // Quicker hide for subtle exit animation
    }
  }, [isOpen]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const password = formData.get("password") as string | null;
    const email = formData.get("email") as string | null;

    if (email && password) {
      try {
        await login({ email, password });
        onClose(); // Close the dialog after successful login
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else {
      console.error("Email and password are required.");
    }
  }

  if (!show) return null;

  return (
    <div
      onClick={handleOutsideClick}
      className={`font-montserrat fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100] transition-opacity duration-300 ease-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-lg transform transition-all duration-500 ease-out ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="flex justify-between items-center border-b pb-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
          >
            <X />
          </button>
          <h3 className=" font-semibold">Log in or Sign up</h3>
          <div></div>
        </div>
        <form className="mt-4 space-y-2 mb-6" onSubmit={handleSubmit}>
          <p className="text-xl font-bold">Welcome to Airbnb</p>
          <Input name="email" type="email" placeholder="Email"></Input>
          <Input name="password" type="password" placeholder="Password"></Input>
          <p className="text-xs">
            We’ll call or text you to confirm your number. Standard message and
            data rates apply.{" "}
            <a className="font-bold underline " href="privacy-policy">
              Privacy Policy
            </a>
          </p>
          <Button
            type="submit"
            variant="secondary"
            className="h-12 text-[16px] "
          >
            Continue
          </Button>
        </form>
        <div className="flex justify-between items-center gap-4">
          <hr className="w-[50%] border-t-2 border-gray-200" />
          <p className="text-xs">or</p>
          <hr className="w-[50%] border-t-2 border-gray-200" />
        </div>
        <div className="w-full flex justify-center pt-4">
          <GoogleLogin
            shape="circle"
            theme="outline"
            width="1000"
            size="large"
            text="continue_with"
            locale="en-US"
            onSuccess={async (credentialResponse: CredentialResponse) => {
              if (credentialResponse.credential) {
                try {
                  await handleGoogleSuccess({
                    credential: credentialResponse.credential,
                  });
                  onClose(); // Close the dialog after successful login
                } catch (error) {
                  console.error("Google login failed:", error);
                }
              } else {
                console.error("Google credential is undefined");
              }
            }}
            onError={() => {
              console.error("Error working with Google");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
