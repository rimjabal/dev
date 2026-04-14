import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axios';

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([api.get('/projects'), api.get('/columns')]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch {
        setError('Erreur chargement');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const addProject = useCallback(async (name: string, color: string) => {
    setError(null);
    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects((prev) => [...prev, data]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Erreur: ${err.response?.status}`);
      }
    }
  }, []);

  const renameProject = useCallback(async (project: Project) => {
    const newName = prompt('Nouveau nom :', project.name);
    if (!newName || newName === project.name) {
      return;
    }

    try {
      const { data } = await api.put(`/projects/${project.id}`, {
        ...project,
        name: newName,
      });
      setProjects((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Erreur: ${err.response?.status}`);
      }
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    if (!confirm('Etes-vous sur ?')) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Erreur: ${err.response?.status}`);
      }
    }
  }, []);

  return { projects, columns, loading, error, addProject, renameProject, deleteProject };
}