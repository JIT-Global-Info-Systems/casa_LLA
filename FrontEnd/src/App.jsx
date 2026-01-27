import AppRoutes from "./routes/AppRoutes";
import { LeadsProvider } from "./context/LeadsContext.jsx";
import { MediatorsProvider } from "./context/MediatorsContext.jsx";
import { UsersProvider } from "./context/UsersContext.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import { CallsProvider } from "./context/CallsContext.jsx"
import { MasterProvider } from "./context/Mastercontext.jsx"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <AuthProvider>
      <LeadsProvider>
        <MediatorsProvider>
          <UsersProvider>
            <CallsProvider>
              <MasterProvider>
                <AppRoutes />
                <Toaster />
              </MasterProvider>
            </CallsProvider>
          </UsersProvider>
        </MediatorsProvider>
      </LeadsProvider>
    </AuthProvider>
  )
}

export default App;
