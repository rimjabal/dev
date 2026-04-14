import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import HeaderMUI from '../components/HeaderMUI';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';
import useProjects, { type Project } from '../hooks/useProjects';
import type { AppDispatch, RootState } from '../store';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { projects, columns, loading, error, addProject, renameProject, deleteProject } = useProjects();

  const handleRenameProject = useCallback(
    (project: Project) => {
      void renameProject(project);
    },
    [renameProject],
  );

  const handleDeleteProject = useCallback(
    (id: string) => {
      void deleteProject(id);
    },
    [deleteProject],
  );

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <HeaderMUI 
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        userName={userName}
        onLogout={() => dispatch(logout())}
      />
      <div className={styles.body}>
        <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRenameProject={handleRenameProject}
          onDeleteProject={handleDeleteProject}
        />
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm ? (
              <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Creer"
                onSubmit={async (name, color) => {
                  await addProject(name, color);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
            {error && <div className={styles.error}>{error}</div>}
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}