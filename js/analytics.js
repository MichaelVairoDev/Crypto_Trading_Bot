document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
  const timeButtons = document.querySelectorAll(".time-btn");
  const performanceChart = document.getElementById("performanceChart");
  const tradesDistributionChart = document.getElementById(
    "tradesDistributionChart"
  );
  const predictionAccuracyChart = document.getElementById(
    "predictionAccuracyChart"
  );
  const recentTradesBody = document.getElementById("recentTradesBody");

  // Configuración inicial de los gráficos
  initializeCharts();

  // Manejador para los botones de tiempo
  timeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      timeButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      updateCharts(this.dataset.period);
    });
  });

  // Función para inicializar los gráficos
  function initializeCharts() {
    // Gráfico de Rendimiento
    new Chart(performanceChart, {
      type: "line",
      data: {
        labels: generateTimeLabels("1d", 24),
        datasets: [
          {
            label: "Balance del Portfolio",
            data: generatePerformanceData(24),
            borderColor: "#2962ff",
            backgroundColor: "rgba(41, 98, 255, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    // Gráfico de Distribución de Operaciones
    new Chart(tradesDistributionChart, {
      type: "bar",
      data: {
        labels: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT", "DOT/USDT"],
        datasets: [
          {
            label: "Operaciones Exitosas",
            data: [45, 32, 28, 19, 15],
            backgroundColor: "#4CAF50",
          },
          {
            label: "Operaciones Fallidas",
            data: [20, 15, 12, 8, 7],
            backgroundColor: "#f44336",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    // Gráfico de Precisión de Predicciones
    new Chart(predictionAccuracyChart, {
      type: "line",
      data: {
        labels: generateTimeLabels("1d", 12),
        datasets: [
          {
            label: "Precisión de Predicciones",
            data: generatePredictionData(12),
            borderColor: "#ff9800",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    // Cargar operaciones recientes
    loadRecentTrades();
  }

  // Función para generar etiquetas de tiempo
  function generateTimeLabels(period, count) {
    const labels = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      switch (period) {
        case "1d":
          labels.push(new Date(now - i * 3600000).getHours() + ":00");
          break;
        case "1w":
          labels.push(new Date(now - i * 86400000).toLocaleDateString());
          break;
        default:
          labels.push(new Date(now - i * 3600000).toLocaleDateString());
      }
    }
    return labels;
  }

  // Función para generar datos de rendimiento simulados
  function generatePerformanceData(count) {
    const data = [];
    let value = 10000;
    for (let i = 0; i < count; i++) {
      value = value * (1 + (Math.random() * 0.04 - 0.02));
      data.push(value.toFixed(2));
    }
    return data;
  }

  // Función para generar datos de predicción simulados
  function generatePredictionData(count) {
    const data = [];
    let accuracy = 75;
    for (let i = 0; i < count; i++) {
      accuracy = Math.min(95, Math.max(60, accuracy + (Math.random() * 6 - 3)));
      data.push(accuracy.toFixed(1));
    }
    return data;
  }

  // Función para cargar operaciones recientes
  function loadRecentTrades() {
    const trades = [
      {
        date: "2024-02-28 14:30",
        pair: "BTC/USDT",
        type: "LONG",
        entry: 45000,
        exit: 46200,
        profit: 2.67,
      },
      {
        date: "2024-02-28 13:15",
        pair: "ETH/USDT",
        type: "SHORT",
        entry: 3200,
        exit: 3150,
        profit: 1.56,
      },
      {
        date: "2024-02-28 12:45",
        pair: "SOL/USDT",
        type: "LONG",
        entry: 120,
        exit: 118,
        profit: -1.67,
      },
      {
        date: "2024-02-28 11:30",
        pair: "ADA/USDT",
        type: "LONG",
        entry: 0.55,
        exit: 0.57,
        profit: 3.64,
      },
      {
        date: "2024-02-28 10:15",
        pair: "DOT/USDT",
        type: "SHORT",
        entry: 7.2,
        exit: 7.1,
        profit: 1.39,
      },
    ];

    recentTradesBody.innerHTML = trades
      .map(
        (trade) => `
            <tr>
                <td>${trade.date}</td>
                <td>${trade.pair}</td>
                <td>${trade.type}</td>
                <td>$${trade.entry}</td>
                <td>$${trade.exit}</td>
                <td class="${trade.profit >= 0 ? "positive" : "negative"}">${
          trade.profit
        }%</td>
            </tr>
        `
      )
      .join("");
  }

  // Función para actualizar los gráficos según el período seleccionado
  function updateCharts(period) {
    // Aquí se implementaría la lógica para actualizar los datos de los gráficos
    // según el período seleccionado, haciendo llamadas a la API correspondiente
    console.log("Actualizando gráficos para el período:", period);
  }
});
