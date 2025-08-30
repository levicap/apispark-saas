import React from "react";
import Routes from "./Routes";
import { ProjectProvider } from "./contexts/ProjectContext";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <ToastProvider>
      <ProjectProvider>
        <Routes />
      </ProjectProvider>
    </ToastProvider>
  );
}

export default App;
