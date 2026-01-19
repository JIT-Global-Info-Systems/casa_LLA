import AppRoutes from "./routes/AppRoutes";
import { LeadsProvider } from "./context/LeadsContext.jsx";
import { MediatorsProvider } from "./context/MediatorsContext.jsx";
import { UsersProvider } from "./context/UsersContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <LeadsProvider>
        <MediatorsProvider>
          <UsersProvider>
            <AppRoutes />
          </UsersProvider>
        </MediatorsProvider>
      </LeadsProvider>
    </AuthProvider>
  );
}

export default App;
