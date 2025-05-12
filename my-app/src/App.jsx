import Dashboard from './components/Dashboard';

function App() {
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  
    window.location.href = "https://accounts.google.com/logout";
  };


  return (
    <div>
      <Dashboard onLogout={handleLogout} />
    </div>
  );
}

export default App
