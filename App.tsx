import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { 
    HomePage, 
    ResultsPage, 
    DashboardPage, 
    PasswordSafetyPage, 
    AIAssistantPage,
    ResourcesPage,
    TakedownCenterPage,
    ProfilePage,
    NotFoundPage 
} from './pages';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/password-safety" element={<PasswordSafetyPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/takedown-center" element={<TakedownCenterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;