
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-finance-background">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">SpendSmart</h1>
        <p className="text-gray-600">Track your finances with ease</p>
      </div>
      
      {showLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <RegisterForm onToggleForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthPage;
