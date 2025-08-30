import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DatabaseDesigner from './pages/database-designer';
import AIAssistant from './pages/ai-assistant';
import APITesting from './pages/api-testing';
import APIDesigner from './pages/api-designer';
import TeamManagement from './pages/team-management';
import ApiDocumentation from './pages/api-documentation';
import Dashboard from './pages/dashboard';
import EntityConfigurationPanel from './pages/entity-configuration-panel';
import DatabaseConnectionManager from './pages/database-connection-manager';
import MigrationHistoryManagement from './pages/migration-history-management';
import CodeGenerationExport from './pages/code-generation-export';
import SchemaCanvasDesigner from './pages/schema-canvas-designer';
import Marketplace from './pages/marketplace';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIAssistant />} />
        <Route path="/database-designer" element={<DatabaseDesigner />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/api-testing" element={<APITesting />} />
        <Route path="/api-designer" element={<APIDesigner />} />
        <Route path="/api-documentation" element={<ApiDocumentation />} />
        <Route path="/team-management" element={<TeamManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/entity-configuration-panel" element={<EntityConfigurationPanel />} />
        <Route path="/database-connection-manager" element={<DatabaseConnectionManager />} />
        <Route path="/migration-history-management" element={<MigrationHistoryManagement />} />
        <Route path="/code-generation-export" element={<CodeGenerationExport />} />
        <Route path="/schema-canvas-designer" element={<SchemaCanvasDesigner />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
