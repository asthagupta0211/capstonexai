import { useState, useCallback } from 'react';
import { ProjectIdea, ProjectPlan, StudentProfile } from '../types/index.js';
import { api } from '../services/api.js';

interface UseIdeaStudioReturn {
  ideas: ProjectIdea[];
  setIdeas: React.Dispatch<React.SetStateAction<ProjectIdea[]>>;
  comparedIdeas: ProjectIdea[];
  setComparedIdeas: React.Dispatch<React.SetStateAction<ProjectIdea[]>>;
  isGenerating: boolean;
  selectedPlanIdea: ProjectIdea | null;
  currentPlan: ProjectPlan | null;
  errorMessage: string | null;
  setSelectedPlanIdea: React.Dispatch<React.SetStateAction<ProjectIdea | null>>;
  setCurrentPlan: React.Dispatch<React.SetStateAction<ProjectPlan | null>>;
  loadIdeas: () => Promise<void>;
  handleGenerateIdeas: (targetProfile: StudentProfile, onSuccess?: () => void) => Promise<void>;
  handleToggleSaveIdea: (id: string) => Promise<void>;
  handleDeleteIdea: (id: string) => Promise<void>;
  handleToggleCompare: (idea: ProjectIdea) => void;
  handleSelectPlan: (idea: ProjectIdea, onBeforeSelect?: () => void) => Promise<void>;
  resetStudio: () => void;
}

export function useIdeaStudio(): UseIdeaStudioReturn {
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [comparedIdeas, setComparedIdeas] = useState<ProjectIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlanIdea, setSelectedPlanIdea] = useState<ProjectIdea | null>(null);
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadIdeas = useCallback(async () => {
    try {
      const ideaList = await api.listIdeas();
      if (ideaList.ideas) {
        setIdeas(ideaList.ideas);
      }
    } catch {
      // Non-blocking
    }
  }, []);

  const handleGenerateIdeas = async (targetProfile: StudentProfile, onSuccess?: () => void) => {
    try {
      setErrorMessage(null);
      setIsGenerating(true);
      const res = await api.generateIdeas(targetProfile);
      setIdeas(res.ideas);
      setSelectedPlanIdea(null);
      setCurrentPlan(null);
      onSuccess?.();
    } catch (err: any) {
      setErrorMessage(err.message);
      alert('Error generating ideas: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSaveIdea = async (id: string) => {
    try {
      const res = await api.toggleSaveIdea(id);
      setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, isSaved: res.idea.isSaved } : i)));
      if (selectedPlanIdea?.id === id) {
        setSelectedPlanIdea((prev) => (prev ? { ...prev, isSaved: res.idea.isSaved } : null));
      }
    } catch (err: any) {
      alert('Failed to save idea: ' + err.message);
    }
  };

  const handleDeleteIdea = async (id: string) => {
    try {
      await api.deleteIdea(id);
      setIdeas((prev) => prev.filter((i) => i.id !== id));
      setComparedIdeas((prev) => prev.filter((i) => i.id !== id));
      if (selectedPlanIdea?.id === id) {
        setSelectedPlanIdea(null);
        setCurrentPlan(null);
      }
    } catch (err: any) {
      alert('Failed to delete idea: ' + err.message);
    }
  };

  const handleToggleCompare = (idea: ProjectIdea) => {
    setComparedIdeas((prev) => {
      const exists = prev.some((i) => i.id === idea.id);
      if (exists) {
        return prev.filter((i) => i.id !== idea.id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 project ideas simultaneously.');
        return prev;
      }
      return [...prev, idea];
    });
  };

  const handleSelectPlan = async (idea: ProjectIdea, onBeforeSelect?: () => void) => {
    onBeforeSelect?.();
    setSelectedPlanIdea(idea);
    try {
      const res = await api.getPlan(idea.id);
      setCurrentPlan(res.plan);
    } catch (err: any) {
      alert('Failed to load blueprint: ' + err.message);
      setSelectedPlanIdea(null);
    }
  };

  const resetStudio = () => {
    setIdeas([]);
    setComparedIdeas([]);
    setSelectedPlanIdea(null);
    setCurrentPlan(null);
  };

  return {
    ideas,
    setIdeas,
    comparedIdeas,
    setComparedIdeas,
    isGenerating,
    selectedPlanIdea,
    currentPlan,
    errorMessage,
    setSelectedPlanIdea,
    setCurrentPlan,
    loadIdeas,
    handleGenerateIdeas,
    handleToggleSaveIdea,
    handleDeleteIdea,
    handleToggleCompare,
    handleSelectPlan,
    resetStudio,
  };
}
