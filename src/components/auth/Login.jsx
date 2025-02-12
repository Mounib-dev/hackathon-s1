import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  //   const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ email, password });
      // If login is successful, the AuthProvider will handle the navigation to /home
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., display an error message)
    }
  };

  return (
    <>
      <div>
        {/* <header>
          <img
            className="mx-auto mt-10 mb-6 w-25"
            src="/logo.webp"
            alt="Logo"
          />
        </header> */}
        <div className="mx-auto my-15 w-full max-w-md rounded-2xl bg-indigo-100 p-10 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="mb-3 block text-lg font-semibold text-indigo-700">
                Email:
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-indigo-700 shadow-md focus:border-indigo-500 focus:outline-none"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input with Eye Icon */}
            <div className="relative mt-4">
              <label className="mb-3 block text-lg font-semibold text-indigo-700">
                Password:
              </label>
              <input
                className="w-full rounded-md border px-4 py-3 pr-12 text-indigo-700 shadow-md focus:border-indigo-500 focus:outline-none"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Eye Button */}
              <button
                type="button"
                className="absolute top-1/2 right-3 translate-y-1/2 transform text-indigo-500 hover:text-indigo-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <button
                className="focus:shadow-outline rounded-md bg-indigo-700 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-500 focus:outline-none"
                type="submit"
              >
                Se connecter
              </button>
              <a
                className="inline-block align-baseline text-sm font-bold text-indigo-500 hover:text-indigo-800"
                href="#"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </form>
          <div className="mt-6 text-center">
            <a
              className="inline-block align-baseline text-sm font-bold text-indigo-500 hover:text-indigo-800"
              href="/register"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
