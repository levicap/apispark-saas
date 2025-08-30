import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useProjectContext } from '../../contexts/ProjectContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import GenerationOptionsPanel from './components/GenerationOptionsPanel';
import CodePreviewPanel from './components/CodePreviewPanel';
import ExportSettingsPanel from './components/ExportSettingsPanel';
import GenerationStatusBar from './components/GenerationStatusBar';

const CodeGenerationExport = () => {
  const { currentProject, getCurrentProjectSchema } = useProjectContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState(['sql', 'prisma', 'typescript']);
  const [selectedDatabase, setSelectedDatabase] = useState('postgresql');
  const [selectedPreset, setSelectedPreset] = useState('full-stack');
  const [activeTab, setActiveTab] = useState('sql');
  const [generatedCode, setGeneratedCode] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [generationStatus, setGenerationStatus] = useState({
    isGenerating: false,
    progress: 0,
    currentStep: '',
    totalFiles: 0,
    generatedFiles: 0,
    errors: []
  });
  const [exportSettings, setExportSettings] = useState({
    fileNaming: 'snake_case',
    directoryStructure: 'feature',
    includeComments: true,
    includeTimestamps: true,
    generateMigrations: true,
    generateSeeds: false,
    deploymentTarget: 'github',
    repositoryUrl: '',
    branchName: 'main',
    commitMessage: 'Generated schema files'
  });

  // Mock user data for header
  const mockUser = {
    name: 'Sarah Chen',
    email: 'sarah.chen@apiforge.com'
  };

  // Update database type when project changes
  useEffect(() => {
    if (currentProject) {
      setSelectedDatabase(currentProject.databaseType?.toLowerCase() || 'postgresql');
    }
  }, [currentProject]);

  // Handle format selection changes
  const handleFormatChange = (formatId, isSelected) => {
    setSelectedFormats(prev => 
      isSelected 
        ? [...prev, formatId]
        : prev?.filter(id => id !== formatId)
    );
  };

  // Handle preset changes
  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    
    // Update selected formats based on preset
    switch (preset) {
      case 'full-stack':
        setSelectedFormats(['sql', 'prisma', 'typescript', 'graphql']);
        break;
      case 'backend-only':
        setSelectedFormats(['sql', 'prisma']);
        break;
      case 'frontend-types':
        setSelectedFormats(['typescript', 'graphql']);
        break;
      case 'api-docs':
        setSelectedFormats(['openapi', 'graphql']);
        break;
      default:
        // Keep current selection for custom
        break;
    }
  };

  // Generate all selected formats
  const handleGenerateAll = () => {
    if (selectedFormats?.length === 0) {
      setGenerationStatus(prev => ({
        ...prev,
        errors: [{ message: 'Please select at least one output format', file: 'Configuration' }]
      }));
      return;
    }

    setIsGenerating(true);
    setGenerationStatus({
      isGenerating: true,
      progress: 0,
      currentStep: 'Initializing generation...',
      totalFiles: selectedFormats?.length,
      generatedFiles: 0,
      errors: []
    });

    // Simulate generation process
    let progress = 0;
    const steps = [
      'Analyzing schema structure...',
      'Generating SQL scripts...',
      'Creating ORM models...',
      'Building TypeScript types...',
      'Finalizing output...'
    ];

    const interval = setInterval(() => {
      progress += 20;
      const stepIndex = Math.floor(progress / 20) - 1;
      
      setGenerationStatus(prev => ({
        ...prev,
        progress,
        currentStep: steps?.[stepIndex] || 'Completing...',
        generatedFiles: Math.floor(progress / 20)
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        setGenerationStatus(prev => ({
          ...prev,
          isGenerating: false,
          currentStep: 'Generation complete',
          generatedFiles: selectedFormats?.length
        }));
      }
    }, 1000);
  };

  // Handle code copying
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard?.writeText(code);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Handle file download
  const handleDownloadFile = (fileData) => {
    const blob = new Blob([fileData.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileData?.name;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle batch export
  const handleBatchExport = () => {
    setExportProgress(0);
    
    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setExportProgress(null), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle direct deployment
  const handleDirectDeploy = () => {
    if (!exportSettings?.repositoryUrl) {
      setGenerationStatus(prev => ({
        ...prev,
        errors: [{ message: 'Repository URL is required for deployment', file: 'Deployment Settings' }]
      }));
      return;
    }
    
    // Simulate deployment process
    console.log('Deploying to:', exportSettings?.deploymentTarget);
  };

  // Handle generation cancellation
  const handleCancelGeneration = () => {
    setIsGenerating(false);
    setGenerationStatus({
      isGenerating: false,
      progress: 0,
      currentStep: '',
      totalFiles: 0,
      generatedFiles: 0,
      errors: [{ message: 'Generation cancelled by user', file: 'System' }]
    });
  };

  // Handle retry generation
  const handleRetryGeneration = () => {
    setGenerationStatus(prev => ({
      ...prev,
      errors: []
    }));
    handleGenerateAll();
  };

  // Clear errors
  const handleClearErrors = () => {
    setGenerationStatus(prev => ({
      ...prev,
      errors: [],
      generatedFiles: 0,
      totalFiles: 0
    }));
  };

  // Handle settings changes
  const handleSettingsChange = (newSettings) => {
    setExportSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return (
    <>
      <Helmet>
        <title>Code Generation & Export - DataFlow Designer</title>
        <meta name="description" content="Generate database schemas, migration scripts, and ORM configurations from visual designs across multiple formats and frameworks." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          user={mockUser}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className={`transition-smooth ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
        } pt-16 pb-16 md:pb-0`}>
          
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Generation Options Panel */}
            <GenerationOptionsPanel
              selectedFormats={selectedFormats}
              onFormatChange={handleFormatChange}
              selectedDatabase={selectedDatabase}
              onDatabaseChange={setSelectedDatabase}
              selectedPreset={selectedPreset}
              onPresetChange={handlePresetChange}
              onGenerateAll={handleGenerateAll}
            />

            {/* Code Preview Panel */}
            <CodePreviewPanel
              generatedCode={generatedCode}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onCopyCode={handleCopyCode}
              onDownloadFile={handleDownloadFile}
              isGenerating={isGenerating}
            />

            {/* Export Settings Panel */}
            <ExportSettingsPanel
              settings={exportSettings}
              onSettingsChange={handleSettingsChange}
              onBatchExport={handleBatchExport}
              onDirectDeploy={handleDirectDeploy}
              exportProgress={exportProgress}
            />
          </div>
        </main>

        {/* Generation Status Bar */}
        <GenerationStatusBar
          isGenerating={generationStatus?.isGenerating}
          progress={generationStatus?.progress}
          currentStep={generationStatus?.currentStep}
          totalFiles={generationStatus?.totalFiles}
          generatedFiles={generationStatus?.generatedFiles}
          errors={generationStatus?.errors}
          onCancelGeneration={handleCancelGeneration}
          onRetryGeneration={handleRetryGeneration}
          onClearErrors={handleClearErrors}
        />
      </div>
    </>
  );
};

export default CodeGenerationExport;