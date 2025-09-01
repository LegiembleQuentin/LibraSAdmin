<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { authService } from '../../lib/services/authService';
  import { statsService, type AdminStatsDto } from '$lib/services/statsService';
  import Button from '$lib/components/Button.svelte';
  import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

  Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

  let loading = true;
  let error = '';
  let stats: AdminStatsDto | null = null;

  let canvasEngagement: HTMLCanvasElement;
  let chartEngagement: Chart | null = null;
  let canvasGrowth: HTMLCanvasElement;
  let chartGrowth: Chart | null = null;
  let canvasTopVisits: HTMLCanvasElement;
  let chartTopVisits: Chart | null = null;
  let canvasTopRatings: HTMLCanvasElement;
  let chartTopRatings: Chart | null = null;

  function disposeCharts() {
    chartEngagement?.destroy(); chartEngagement = null;
    chartGrowth?.destroy(); chartGrowth = null;
    chartTopVisits?.destroy(); chartTopVisits = null;
    chartTopRatings?.destroy(); chartTopRatings = null;
  }

  function buildCharts() {
    if (!stats) return;
    disposeCharts();

    // 1) Engagement: DAU / WAU / MAU
    chartEngagement = new Chart(canvasEngagement, {
      type: 'bar',
      data: {
        labels: ['DAU', 'WAU', 'MAU'],
        datasets: [{
          label: 'Utilisateurs actifs',
          data: [stats.dau, stats.wau, stats.mau],
          backgroundColor: ['#60a5fa', '#34d399', '#fbbf24']
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // Helpers pour noms et valeurs
    const names = (arr: any[] | undefined, key = 'names') => (arr || []).map((b: any) => Array.isArray(b?.[key]) ? b[key][0] : (b?.name ?? 'N/A'));

    // 3) Top visites (max 10)
    const visits = (stats.topBooksByVisits || []).slice(0, 10);
    chartTopVisits = new Chart(canvasTopVisits, {
      type: 'bar',
      data: {
        labels: names(visits),
        datasets: [{ label: 'Visites', data: visits.map((b: any) => b.nbVisit ?? 0), backgroundColor: '#10b981' }]
      },
      options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }
    });

    // 4) Top notes (max 10)
    const ratings = (stats.topBooksByRating || []).slice(0, 10);
    chartTopRatings = new Chart(canvasTopRatings, {
      type: 'bar',
      data: {
        labels: names(ratings),
        datasets: [{ label: 'Note', data: ratings.map((b: any) => b.note ?? 0), backgroundColor: '#a78bfa' }]
      },
      options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { suggestedMax: 10 } } }
    });
  }

  onMount(async () => {
    const isAuthenticated = await authService.verifyAuth();
    if (!isAuthenticated) {
      goto('/');
      return;
    }
    try {
      loading = true;
      error = '';
      stats = await statsService.getAdminStats();
    } catch (e) {
      console.error(e);
      error = e instanceof Error ? e.message : 'Erreur lors du chargement des statistiques';
    } finally {
      loading = false;
      await tick();
      buildCharts();
    }
  });

  onDestroy(() => disposeCharts());
</script>

<svelte:head>
  <title>Administration - Statistiques</title>
</svelte:head>

<div class="page-container">
  <div class="page-header">
    <h1 class="page-title">Statistiques</h1>
    <p class="page-subtitle">Consultez les statistiques de la bibliothèque</p>
  </div>

  <div class="page-content">
    {#if loading}
      <div class="loading">Chargement...</div>
    {:else if error}
      <div class="error">{error}</div>
    {:else if stats}
      <section class="cards-grid">
        <div class="card">
          <h3>Utilisateurs</h3>
          <div class="metrics">
            <div><span>Total</span><strong>{stats.totalUsers}</strong></div>
            <div><span>+ Jour</span><strong>{stats.newUsersDay}</strong></div>
            <div><span>+ Semaine</span><strong>{stats.newUsersWeek}</strong></div>
            <div><span>+ Mois</span><strong>{stats.newUsersMonth}</strong></div>
          </div>
        </div>
        <div class="card">
          <h3>Activité</h3>
          <div class="metrics">
            <div><span>DAU</span><strong>{stats.dau}</strong></div>
            <div><span>WAU</span><strong>{stats.wau}</strong></div>
            <div><span>MAU</span><strong>{stats.mau}</strong></div>
          </div>
        </div>
        <div class="card">
          <h3>Livres</h3>
          <div class="metrics">
            <div><span>Total</span><strong>{stats.totalBooks}</strong></div>
            <div><span>+ Jour</span><strong>{stats.newBooksDay}</strong></div>
            <div><span>+ Semaine</span><strong>{stats.newBooksWeek}</strong></div>
            <div><span>+ Mois</span><strong>{stats.newBooksMonth}</strong></div>
          </div>
        </div>
      </section>

      <section class="charts-grid">
        <div class="chart-card">
          <h3>Engagement utilisateurs</h3>
          <canvas bind:this={canvasEngagement}></canvas>
        </div>
        <div class="chart-card">
          <h3>Top visites</h3>
          <canvas bind:this={canvasTopVisits}></canvas>
        </div>
        <div class="chart-card">
          <h3>Mieux notés</h3>
          <canvas bind:this={canvasTopRatings}></canvas>
        </div>
        <div class="table-card">
          <h3>Auteurs populaires</h3>
          <table>
            <thead><tr><th>Auteur</th><th>Lecteurs</th></tr></thead>
            <tbody>
              {#each stats.topAuthorsByReaders || [] as a}
                <tr>
                  <td>{a.name}</td>
                  <td>{a.count}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>

      <section class="tables-grid">
        <div class="table-card">
          <h3>Tags populaires</h3>
          <table>
            <thead><tr><th>Tag</th><th>Lecteurs</th></tr></thead>
            <tbody>
              {#each stats.topTagsByReaders || [] as t}
                <tr>
                  <td>{t.name}</td>
                  <td>{t.count}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}
  </div>
</div>

<style>
  .page-container { padding: 2rem; }
  .page-header { margin-bottom: 1.5rem; }
  .page-title { margin: 0 0 .25rem 0; }
  .page-subtitle { margin: 0; opacity: .8; }
  .loading, .error { padding: 1rem; }
  .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; }
  .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: .5rem 1rem; margin-top: .5rem; }
  .metrics div { display: flex; align-items: center; justify-content: space-between; }
  .charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .chart-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; }
  .chart-card canvas { width: 100% !important; max-width: 100%; height: 320px !important; }
  .tables-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .table-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: .5rem .75rem; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: left; }
  th { opacity: .8; }
  @media (max-width: 1024px) { .cards-grid { grid-template-columns: 1fr; } .charts-grid { grid-template-columns: 1fr; } .tables-grid { grid-template-columns: 1fr; } }
</style>
