import { useAuth } from "../../context/AuthContext";

function LoginPage() {
    const { login } = useAuth();

    const handleManualLogin = () => {
        const token = prompt("Paste JWT token here:");

        if (token) {
            login(token);
            alert("Logged in. Now navigate to dashboard route.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl mb-4">Manual Login Test</h1>
            <button
                onClick={handleManualLogin}
                className="bg-primary text-white px-4 py-2 rounded"
            >
                Paste JWT & Login
            </button>
        </div>
    );
}

export default LoginPage;