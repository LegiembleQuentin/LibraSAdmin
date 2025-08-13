<script lang="ts">
  export let stats: {
    totalUsers: number;
    averageVolume: number;
    usersInProgress: number;
    usersCompleted: number;
    usersNotStarted: number;
    averageProgress: number;
    completionRate: number;
  };
</script>

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value">{stats.totalUsers}</div>
    <div class="stat-label">Utilisateurs</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">{stats.averageVolume.toFixed(1)}</div>
    <div class="stat-label">Volume moyen</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">{stats.averageProgress.toFixed(1)}%</div>
    <div class="stat-label">Progression moyenne</div>
  </div>
  
  <div class="stat-card">
    <div class="stat-value">{stats.completionRate.toFixed(1)}%</div>
    <div class="stat-label">Taux de completion</div>
  </div>
</div>

<div class="status-breakdown">
  <h4>Répartition des statuts</h4>
  <div class="status-bars">
    <div class="status-bar">
      <div class="status-label">En cours</div>
      <div class="status-bar-container">
        <div class="status-bar-fill in-progress" style="width: {stats.totalUsers > 0 ? (stats.usersInProgress / stats.totalUsers) * 100 : 0}%"></div>
      </div>
      <div class="status-count">{stats.usersInProgress}</div>
    </div>
    
    <div class="status-bar">
      <div class="status-label">Complété</div>
      <div class="status-bar-container">
        <div class="status-bar-fill completed" style="width: {stats.totalUsers > 0 ? (stats.usersCompleted / stats.totalUsers) * 100 : 0}%"></div>
      </div>
      <div class="status-count">{stats.usersCompleted}</div>
    </div>
    
    <div class="status-bar">
      <div class="status-label">Non commencé</div>
      <div class="status-bar-container">
        <div class="status-bar-fill not-started" style="width: {stats.totalUsers > 0 ? (stats.usersNotStarted / stats.totalUsers) * 100 : 0}%"></div>
      </div>
      <div class="status-count">{stats.usersNotStarted}</div>
    </div>
  </div>
</div>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
    padding: 1.5rem;
    text-align: center;
    backdrop-filter: blur(10px);
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-accent);
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-breakdown {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-md);
    padding: 1.5rem;
    backdrop-filter: blur(10px);
  }

  .status-breakdown h4 {
    margin: 0 0 1.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-white);
  }

  .status-bars {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .status-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .status-label {
    min-width: 100px;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .status-bar-container {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .status-bar-fill {
    height: 100%;
    transition: width 0.3s ease;
  }

  .status-bar-fill.in-progress {
    background: var(--color-accent);
  }

  .status-bar-fill.completed {
    background: #34C759;
  }

  .status-bar-fill.not-started {
    background: rgba(255, 255, 255, 0.3);
  }

  .status-count {
    min-width: 40px;
    text-align: right;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-white);
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .stat-card {
      padding: 1rem;
    }

    .stat-value {
      font-size: 1.5rem;
    }

    .status-label {
      min-width: 80px;
      font-size: 0.8rem;
    }
  }
</style>
