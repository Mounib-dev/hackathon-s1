import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "lucide-react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const chatContainerRef = useRef(null);

  const { token } = useAuth();

  // AJOUTER UN DISABLE DU BOUTON PENDANT LE CHARGEMENT DE L'HISTORIQUE
  useEffect(() => {
    setLoadingHistory(true);
    fetch("http://localhost:3000/api/v1/chatbot/history", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.length);
        if (data.length > 0) {
          console.log("salut");
          setMessages(data[0].messages);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingHistory(false);
        }, 1000);
      });
  }, []);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/chatbot/assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        },
      );

      if (!response.body) {
        console.error("No response body received.");
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = { role: "assistant", content: "" };

      const readStream = async () => {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });

          text.split("\n").forEach((line) => {
            if (line.startsWith("data:")) {
              try {
                const json = JSON.parse(line.replace("data: ", ""));
                botMessage.content += json.text;
                setMessages(() => [...newMessages, { ...botMessage }]);
              } catch (err) {
                console.error("JSON parse error:", err);
              }
            }
          });
        }
      };

      await readStream();
    } catch (error) {
      console.error("Request error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white text-gray-900">
      <div className="w-full max-w-2xl rounded-lg bg-gray-100 p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-pink-700">
          🤖 Assistant Chatbot
        </h2>
        <div
          ref={chatContainerRef}
          className="h-96 overflow-y-auto rounded-md border border-gray-300 bg-gray-50 p-4"
        >
          {loadingHistory ? (
            <>
              <div className="flex">
                <span className="text-pink-500">
                  Chargement de l&apos;historique de votre conversation
                </span>
                <Loader className="ml-3 h-6 w-6 animate-spin text-pink-500" />
              </div>
            </>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 max-w-xs rounded-lg p-3 text-sm sm:max-w-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-pink-500 text-right text-white"
                    : "bg-pink-100 text-gray-900"
                }`}
              >
                <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
                {msg.content}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for help..."
            className="flex-1 rounded-md border border-gray-300 bg-white p-3 text-gray-900 focus:ring-2 focus:ring-pink-700 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 rounded-md bg-pink-700 px-4 py-3 text-white transition hover:bg-pink-800"
            disabled={loading || loadingHistory}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
