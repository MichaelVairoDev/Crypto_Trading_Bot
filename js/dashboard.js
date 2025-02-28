// Configuración de los gráficos
document.addEventListener("DOMContentLoaded", function () {
  // Configuración del tema oscuro/claro
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const chartTextColor = isDarkMode ? "#e5e5e5" : "#2c3e50";
  const chartGridColor = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";

  // Animación de números
  function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (
        (increment > 0 && current >= end) ||
        (increment < 0 && current <= end)
      ) {
        clearInterval(timer);
        current = end;
      }
      element.textContent = formatCurrency(current);
    }, 16);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  }

  // Animar el balance total
  const balanceElement = document.querySelector(".animated-value");
  if (balanceElement) {
    const finalValue = parseFloat(
      balanceElement.textContent.replace(/[^0-9.-]+/g, "")
    );
    animateValue(balanceElement, 0, finalValue, 1000);
  }

  // Gráfico del Portfolio
  const portfolioCtx = document
    .getElementById("portfolioChart")
    .getContext("2d");
  const portfolioGradient = portfolioCtx.createLinearGradient(0, 0, 0, 400);
  portfolioGradient.addColorStop(0, "rgba(41, 98, 255, 0.2)");
  portfolioGradient.addColorStop(1, "rgba(41, 98, 255, 0)");

  const portfolioChart = new Chart(portfolioCtx, {
    type: "doughnut",
    data: {
      labels: ["Bitcoin", "Ethereum", "Cardano", "Solana", "Otros"],
      datasets: [
        {
          data: [40, 25, 15, 10, 10],
          backgroundColor: [
            "#FF9F40",
            "#36A2EB",
            "#4BC0C0",
            "#9966FF",
            "#FF6384",
          ],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            font: {
              size: 12,
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed}%`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    },
  });

  // Gráfico de Rendimiento
  const performanceCtx = document
    .getElementById("performanceChart")
    .getContext("2d");
  const performanceGradient = performanceCtx.createLinearGradient(0, 0, 0, 400);
  performanceGradient.addColorStop(0, "rgba(76, 175, 80, 0.2)");
  performanceGradient.addColorStop(1, "rgba(76, 175, 80, 0)");

  const performanceChart = new Chart(performanceCtx, {
    type: "line",
    data: {
      labels: generateTimeLabels(30),
      datasets: [
        {
          label: "Rendimiento del Portfolio",
          data: generatePerformanceData(30),
          borderColor: "#4caf50",
          backgroundColor: performanceGradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 20,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#4caf50",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
              return `${context.parsed.y.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: chartTextColor,
            maxRotation: 0,
          },
        },
        y: {
          grid: {
            color: chartGridColor,
            drawBorder: false,
          },
          ticks: {
            color: chartTextColor,
            callback: function (value) {
              return value.toFixed(1) + "%";
            },
          },
        },
      },
    },
  });

  // Cargar operaciones activas
  loadActiveTrades();

  // Cargar pares de mercado
  loadMarketPairs();

  // Actualizar datos en tiempo real
  setInterval(updateRealTimeData, 5000);

  // Funciones auxiliares
  function generateTimeLabels(count) {
    const labels = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now - i * 3600000);
      labels.push(
        date.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
    return labels;
  }

  function generatePerformanceData(count) {
    const data = [];
    let value = 0;
    for (let i = 0; i < count; i++) {
      value += Math.random() * 2 - 0.5;
      data.push(value);
    }
    return data;
  }
});

// Función para cargar operaciones activas
function loadActiveTrades() {
  const trades = [
    {
      pair: "BTC/USDT",
      type: "LONG",
      entry: 45000,
      current: 46200,
      profit: 2.67,
    },
    {
      pair: "ETH/USDT",
      type: "SHORT",
      entry: 3200,
      current: 3150,
      profit: 1.56,
    },
    { pair: "SOL/USDT", type: "LONG", entry: 120, current: 118, profit: -1.67 },
  ];

  const tradesListElement = document.querySelector(".trades-list");
  tradesListElement.innerHTML = trades
    .map(
      (trade) => `
        <div class="trade-item ${
          trade.profit >= 0 ? "profit" : "loss"
        }" style="animation: slideInLeft 0.5s ease-out">
            <div class="trade-info">
                <span class="pair">${trade.pair}</span>
                <span class="type">${trade.type}</span>
            </div>
            <div class="trade-values">
                <span class="entry">Entrada: $${trade.entry.toLocaleString()}</span>
                <span class="current">Actual: $${trade.current.toLocaleString()}</span>
                <span class="profit">${trade.profit}%</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Función para cargar pares de mercado
function loadMarketPairs() {
  const pairs = [
    { pair: "BTC/USDT", price: 45200, change: 2.5 },
    { pair: "ETH/USDT", price: 3180, change: -1.2 },
    { pair: "BNB/USDT", price: 420, change: 0.8 },
    { pair: "SOL/USDT", price: 118, change: -0.5 },
  ];

  const marketPairsElement = document.querySelector(".market-pairs");
  marketPairsElement.innerHTML = pairs
    .map(
      (pair) => `
        <div class="market-pair-item" style="animation: slideInLeft 0.5s ease-out">
            <span class="pair">${pair.pair}</span>
            <span class="price">$${pair.price.toLocaleString()}</span>
            <span class="change ${pair.change >= 0 ? "positive" : "negative"}">
                <i class="fas fa-${
                  pair.change >= 0 ? "arrow-up" : "arrow-down"
                }"></i>
                ${Math.abs(pair.change)}%
            </span>
        </div>
    `
    )
    .join("");
}

// Función para actualizar datos en tiempo real
function updateRealTimeData() {
  const marketPairItems = document.querySelectorAll(".market-pair-item");
  marketPairItems.forEach((item) => {
    const priceElement = item.querySelector(".price");
    const changeElement = item.querySelector(".change");
    const currentPrice = parseFloat(
      priceElement.textContent.replace(/[^0-9.-]+/g, "")
    );
    const change = (Math.random() * 2 - 1).toFixed(2);

    const newPrice = (currentPrice * (1 + change / 100)).toFixed(2);
    priceElement.textContent = `$${parseFloat(newPrice).toLocaleString()}`;

    changeElement.className = `change ${change >= 0 ? "positive" : "negative"}`;
    changeElement.innerHTML = `
      <i class="fas fa-${change >= 0 ? "arrow-up" : "arrow-down"}"></i>
      ${Math.abs(change)}%
    `;

    // Añadir efecto de pulso al cambio
    priceElement.style.animation = "pulse 0.5s ease-out";
    setTimeout(() => {
      priceElement.style.animation = "";
    }, 500);
  });
}

// Agregar estilos dinámicos
const style = document.createElement("style");
style.textContent = `
    .trade-item {
        padding: 15px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .trade-item.profit .profit {
        color: #4CAF50;
    }

    .trade-item.loss .profit {
        color: #f44336;
    }

    .market-pair-item {
        padding: 12px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .change.positive {
        color: #4CAF50;
    }

    .change.negative {
        color: #f44336;
    }
`;
document.head.appendChild(style);
