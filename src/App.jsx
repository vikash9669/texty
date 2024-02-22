import "./App.css";
import ProtectedRoute from "./ProtectedRoute";
import DashBoard from "./modules/Dashboard";
import Form from "./modules/form";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";

const apiurl = "http://localhost:8000/api/";
function App() {
  

  return (

      <BrowserRouter>
        <Routes>
          <Route
              path="/sign_in"
              element={<Form isSignInPage={true} />}
            />
            <Route
              path="/sign_up"
              element={<Form isSignInPage={false} />}
            />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashBoard apiurl={apiurl} />} />
          </Route>
            
         
        </Routes>
      </BrowserRouter>
  );
}

export default App;
