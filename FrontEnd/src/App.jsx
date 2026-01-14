import AppRoutes from "./routes/AppRoutes";
import { LeadsProvider } from "./context/LeadsContext.jsx";
import { MediatorsProvider } from "./context/MediatorsContext.jsx";
import { UsersProvider } from "./context/UsersContext.jsx";

function App() {
  return (
    <LeadsProvider>
      <MediatorsProvider>
        <UsersProvider>
          <AppRoutes />
        </UsersProvider>
      </MediatorsProvider>
    </LeadsProvider>
  );
}

export default App;
