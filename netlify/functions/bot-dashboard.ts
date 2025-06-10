// netlify/functions/bot-dashboard.ts

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_KEY!;

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };

  // If it's an API request for data
  if (event.queryStringParameters?.api === 'true') {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: visits, error } = await supabase
        .from('bot_visits')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(visits)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  // Return the HTML dashboard
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 Bot Analytics Dashboard</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 5px;
        }

        .stat-label {
            color: #6b7280;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .chart-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .chart-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: #374151;
        }

        .recent-visits {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .visit-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .visit-item:last-child {
            border-bottom: none;
        }

        .bot-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .bot-google { background: #4285f4; color: white; }
        .bot-bing { background: #00809d; color: white; }
        .bot-facebook { background: #1877f2; color: white; }
        .bot-linkedin { background: #0a66c2; color: white; }
        .bot-twitter { background: #1da1f2; color: white; }
        .bot-chatgpt { background: #10a37f; color: white; }
        .bot-claude { background: #cc785c; color: white; }
        .bot-gemini { background: #4285f4; color: white; }
        .bot-copilot { background: #0078d4; color: white; }
        .bot-writesonic { background: #6366f1; color: white; }
        .bot-copy\.ai { background: #8b5cf6; color: white; }
        .bot-neeva { background: #7c3aed; color: white; }
        .bot-perplexity { background: #059669; color: white; }
        .bot-ai\.bot { background: #f59e0b; color: white; }
        .bot-gpt\.bot { background: #10a37f; color: white; }
        .bot-astatic { background: #6b7280; color: white; }
        .bot-outrider { background: #6b7280; color: white; }
        .bot-edgeservices { background: #6b7280; color: white; }
        .bot-nimble { background: #6b7280; color: white; }
        .bot-other { background: #6b7280; color: white; }

        .loading {
            text-align: center;
            padding: 50px;
            color: white;
        }

        .error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #dc2626;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }

        .live-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
            margin-right: 8px;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>🤖 Bot Analytics Dashboard</h1>
            <p><span class="live-indicator"></span>Real-time tracking of search engine bot visits</p>
        </div>

        <div id="loading" class="loading">
            <p>📊 Loading bot analytics...</p>
        </div>

        <div id="error" class="error" style="display: none;">
            <p>❌ Failed to load analytics data. Please check your Supabase configuration.</p>
        </div>

        <div id="dashboard-content" style="display: none;">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value" id="total-visits">0</div>
                    <div class="stat-label">Total Bot Visits</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="today-visits">0</div>
                    <div class="stat-label">Today's Visits</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="unique-jobs">0</div>
                    <div class="stat-label">Jobs Viewed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="top-bot">-</div>
                    <div class="stat-label">Top Bot Type</div>
                </div>
            </div>

            <div class="charts-grid">
                <div class="chart-container">
                    <div class="chart-title">Bot Distribution</div>
                    <canvas id="botChart"></canvas>
                </div>
                <div class="chart-container">
                    <div class="chart-title">Visits Over Time (7 Days)</div>
                    <canvas id="timeChart"></canvas>
                </div>
            </div>

            <div class="recent-visits">
                <div class="chart-title">Recent Bot Visits</div>
                <div id="recent-visits-list">
                    <!-- Visits will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <script>
        let botChart, timeChart;

        async function loadAnalytics() {
            try {
                // Fetch data from our own API endpoint (same function with ?api=true)
                const response = await fetch('/.netlify/functions/bot-dashboard?api=true');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data');
                }
                
                const visits = await response.json();

                updateStats(visits);
                updateCharts(visits);
                updateRecentVisits(visits.slice(0, 20));

                document.getElementById('loading').style.display = 'none';
                document.getElementById('dashboard-content').style.display = 'block';

            } catch (error) {
                console.error('Error loading analytics:', error);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('error').style.display = 'block';
            }
        }

        function updateStats(visits) {
            const today = new Date().toDateString();
            const todayVisits = visits.filter(v => new Date(v.visited_at).toDateString() === today);
            const uniqueJobs = new Set(visits.map(v => v.job_slug)).size;
            
            const botCounts = visits.reduce((acc, v) => {
                acc[v.bot_type] = (acc[v.bot_type] || 0) + 1;
                return acc;
            }, {});
            
            const topBot = Object.entries(botCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

            document.getElementById('total-visits').textContent = visits.length.toLocaleString();
            document.getElementById('today-visits').textContent = todayVisits.length.toLocaleString();
            document.getElementById('unique-jobs').textContent = uniqueJobs.toLocaleString();
            document.getElementById('top-bot').textContent = topBot;
        }

        function updateCharts(visits) {
            // Bot distribution pie chart
            const botCounts = visits.reduce((acc, v) => {
                acc[v.bot_type] = (acc[v.bot_type] || 0) + 1;
                return acc;
            }, {});

            const botLabels = Object.keys(botCounts);
            const botData = Object.values(botCounts);
            const botColors = botLabels.map(bot => {
                const colors = {
                    'Google': '#4285f4',
                    'Bing': '#00809d',
                    'Facebook': '#1877f2',
                    'LinkedIn': '#0a66c2',
                    'Twitter': '#1da1f2',
                    'ChatGPT': '#10a37f',
                    'Claude': '#cc785c',
                    'Gemini': '#4285f4',
                    'Copilot': '#0078d4',
                    'Writesonic': '#6366f1',
                    'Copy.AI': '#8b5cf6',
                    'Neeva': '#7c3aed',
                    'Perplexity': '#059669',
                    'AI Bot': '#f59e0b',
                    'GPT Bot': '#10a37f',
                    'Astatic': '#6b7280',
                    'Outrider': '#6b7280',
                    'EdgeServices': '#6b7280',
                    'Nimble': '#6b7280'
                };
                return colors[bot] || '#6b7280';
            });

            if (botChart) botChart.destroy();
            const botCtx = document.getElementById('botChart').getContext('2d');
            botChart = new Chart(botCtx, {
                type: 'doughnut',
                data: {
                    labels: botLabels,
                    datasets: [{
                        data: botData,
                        backgroundColor: botColors,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });

            // Time series chart
            const last7Days = Array.from({length: 7}, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toDateString();
            }).reverse();

            const dailyCounts = last7Days.map(day => 
                visits.filter(v => new Date(v.visited_at).toDateString() === day).length
            );

            if (timeChart) timeChart.destroy();
            const timeCtx = document.getElementById('timeChart').getContext('2d');
            timeChart = new Chart(timeCtx, {
                type: 'line',
                data: {
                    labels: last7Days.map(day => new Date(day).toLocaleDateString()),
                    datasets: [{
                        label: 'Bot Visits',
                        data: dailyCounts,
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        function updateRecentVisits(recentVisits) {
            const container = document.getElementById('recent-visits-list');
            container.innerHTML = recentVisits.map(visit => {
                const time = new Date(visit.visited_at).toLocaleString();
                const botClass = \`bot-\${visit.bot_type.toLowerCase().replace(/[^a-z0-9]/g, '')}\`;
                
                return \`
                    <div class="visit-item">
                        <div>
                            <span class="bot-badge \${botClass}">\${visit.bot_type}</span>
                            <span style="margin-left: 10px; color: #6b7280;">\${visit.job_slug}</span>
                        </div>
                        <div style="color: #9ca3af; font-size: 0.8rem;">\${time}</div>
                    </div>
                \`;
            }).join('');
        }

        // Auto-refresh every 30 seconds
        setInterval(loadAnalytics, 30000);

        // Load initial data
        loadAnalytics();
    </script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers,
    body: html
  };
};