import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Collaborators from './pages/Collaborators';
import CollaboratorProfile from './pages/CollaboratorProfile';
import Pipeline from './pages/Pipeline';
import AIDiscovery from './pages/AIDiscovery';
import Import from './pages/Import';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/collaborators" element={<Collaborators />} />
          <Route path="/collaborators/:id" element={<CollaboratorProfile />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/ai" element={<AIDiscovery />} />
          <Route path="/import" element={<Import />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
