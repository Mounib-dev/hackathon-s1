import { useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";

function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [registring, setRegistring] = useState(false);

  const registerEndpoint = "/user/register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setRegistring(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + registerEndpoint,
        {
          firstName,
          lastName,
          birthDate,
          phoneNumber,
          email,
          password,
        },
      );
      if (
        response.status === 201 &&
        response.data.message ===
          "Inscription réussie, vous allez recevoir un email de validation sur l'adresse indiquée"
      ) {
        setFirstName("");
        setLastName("");
        setBirthDate("");
        setPhoneNumber("");
        setEmail("");
        setPassword("");
        setRegistring(false);
        setSuccessMessage(response.data.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <div className="mx-auto mt-10 w-full max-w-md rounded-2xl p-10 shadow-xl">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="mb-3 block text-lg font-semibold text-pink-700">
              Nom :
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-pink-700 shadow-md focus:border-pink-500 focus:outline-none"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="mb-3 block text-lg font-semibold text-pink-700">
              Prénom :
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-pink-700 shadow-md focus:border-pink-500 focus:outline-none"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="mb-3 block text-lg font-semibold text-pink-700">
              Date de naissance :
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-pink-700 shadow-md focus:border-pink-500 focus:outline-none"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="mb-3 block text-lg font-semibold text-pink-700">
              Numéro de téléphone :
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-pink-700 shadow-md focus:border-pink-500 focus:outline-none"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="mb-3 block text-lg font-semibold text-pink-700">
              Email :
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-pink-700 shadow-md focus:border-pink-500 focus:outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="mb-3 block text-lg font-semibold text-pink-700">
              Mot de passe :
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded-md border px-4 py-3 leading-tight text-pink-700 shadow-md focus:border-pink-500 focus:outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {successMessage && (
            <p className="mt-4 text-sm font-semibold text-green-600">
              {successMessage}
            </p>
          )}

          {registring && (
            <Loader className="mt-3 ml-3 h-6 w-6 animate-spin text-pink-500" />
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              className="focus:shadow-outline rounded-md bg-pink-700 px-5 py-3 text-lg font-semibold text-white hover:bg-pink-500 focus:outline-none"
              type="submit"
            >
              S&apos;inscrire
            </button>
            <a
              className="inline-block align-baseline text-sm font-bold text-pink-500 hover:text-pink-800"
              href="/login"
            >
              Déjà un compte ? Se connecter
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
