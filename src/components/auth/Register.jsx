/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import axios from "axios";

function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerEndpoint = "/user/register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + registerEndpoint,
        {
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
          phoneNumber: phoneNumber,
          email: email,
          password: password,
        },
      );
      if (
        response.status === 201 &&
        response.data.message ===
          "Inscription réussie, vous pouvez à présent vous connecter"
      ) {
        setFirstName("");
        setLastName("");
        setBirthDate("");
        setPhoneNumber("");
        setEmail("");
        setPassword("");
      }
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
        <div className="mx-auto mt-10 w-full max-w-md rounded-2xl bg-indigo-100 p-10 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="mb-3 block text-lg font-semibold text-indigo-700">
                Nom :
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-indigo-700 shadow-md focus:border-indigo-500 focus:outline-none"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="mb-3 block text-lg font-semibold text-indigo-700">
                Prénom :
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-indigo-700 shadow-md focus:border-indigo-500 focus:outline-none"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="mb-3 block text-lg font-semibold text-indigo-700">
                Date de naissance :
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-indigo-700 shadow-md focus:border-indigo-500 focus:outline-none"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="mb-3 block text-lg font-semibold text-indigo-700">
                Numéro de téléphone :
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-indigo-700 shadow-md focus:border-indigo-500 focus:outline-none"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="mb-3 block text-lg font-semibold text-indigo-700">
                Email :
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-indigo-700 shadow-md focus:border-indigo-500 focus:outline-none"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="mb-3 block text-lg font-semibold text-indigo-700">
                Mot de passe :
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-indigo-700 shadow-md focus:border-indigo-500 focus:outline-none"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-8 flex items-center justify-between">
              <button
                className="focus:shadow-outline rounded-md bg-indigo-700 px-5 py-3 text-lg font-semibold text-white hover:bg-indigo-500 focus:outline-none"
                type="submit"
              >
                S'inscrire
              </button>
              <a
                className="inline-block align-baseline text-sm font-bold text-indigo-500 hover:text-indigo-800"
                href="/login"
              >
                Déjà un compte ? Se connecter
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegistrationForm;
