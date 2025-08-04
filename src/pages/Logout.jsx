import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    // Set the page title dynamically
    document.title = "Logout | The BlinkVault";

    // Clear token from storage
    localStorage.removeItem("token");

    // Redirect after short delay (for better UX)
    const timeout = setTimeout(() => {
      window.location.href = "/login";
    }, 500); // 0.5 second delay

    // Cleanup (not strictly needed here, but good practice)
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="text-center mt-10 text-xl font-semibold">
      Logging out...
    </div>
  );
};

export default Logout;
