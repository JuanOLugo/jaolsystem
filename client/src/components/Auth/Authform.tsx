"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, UserCircle } from "lucide-react";

type FormType = "login" | "register";
type UserRole = "admin" | "empleado";

interface IUserLogin {
  email: string;
  password: string;
}

interface IUserRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

const AuthForms: React.FC = () => {
  const [formType, setFormType] = useState<FormType>("login");
  const [showPassword, setShowPassword] = useState(false);

  const [UserLogin, setUserLogin] = useState<IUserLogin>({
    email: "",
    password: "",
  });
  const [UserRegister, setUserRegister] = useState<IUserRegister>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  const toggleForm = () => {
    setFormType(formType === "login" ? "register" : "login");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formType === "login") {
      console.log(UserLogin);
    }

    if (formType === "register") {
      if(UserRegister.password !== UserRegister.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      console.log(UserRegister);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;

    if (formType === "login") {
      setUserLogin({
        ...UserLogin,
        [name]: target.value,
      });
    }

    if (formType === "register") {
      setUserRegister({
        ...UserRegister,
        [name]: target.value,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {formType === "login" ? "Iniciar sesión" : "Registrarse"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {formType === "register" && (
              <div>
                <label htmlFor="username" className="sr-only">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={UserRegister.username}
                    onChange={handleChange}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Nombre de usuario"
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Correo electrónico"
                  value={
                    formType === "login" ? UserLogin.email : UserRegister.email
                  }
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                  value={
                    formType === "login"
                      ? UserLogin.password
                      : UserRegister.password
                  }
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {formType === "register" && (
              <>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Confirmar contraseña"
                      value={UserRegister.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="role" className="sr-only">
                    Rol
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="role"
                      name="role"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      value={UserRegister.role}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="admin">Admin</option>
                      <option value="empleado">Empleado</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {formType === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={toggleForm}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {formType === "login"
              ? "¿No tienes una cuenta? Regístrate"
              : "¿Ya tienes una cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
