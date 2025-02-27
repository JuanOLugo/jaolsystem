import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForms from "./components/Auth/Authform";
import PrivateRoutes from "./components/RouteSecurity/PrivateRoutes";
import Page from "./components/ErrorPage/Page";
import { Dashboard } from "./components/Dashboard/Dashboard";
import PublicRoutes from "./components/RouteSecurity/PublicRoute";
import SettingsPage from "./components/Settings/SettingsPage";
import Createproducts from "./components/Products/Createproducts";
import ProductTable from "./components/Products/Product-table";
import SalesTable from "./components/Sales/Sales-table";
import Invoicing from "./components/Invoicing/Invoicing";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/auth" element={<AuthForms />} />
        </Route>

        <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<Createproducts/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/products" element={<ProductTable/>} />
        <Route path="/sales" element={<SalesTable/>} />
        <Route path="/invoicing" element={<Invoicing/>} />
        </Route>

        <Route path="*" element={<Page />} />
      </Routes>
    </Router>
  );
}

export default App;
