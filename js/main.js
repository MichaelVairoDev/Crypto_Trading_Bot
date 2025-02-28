// Configuración global de Chart.js
Chart.defaults.font.family = "'Inter', 'system-ui', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = "#6b7280";
Chart.defaults.plugins.tooltip.backgroundColor = "rgba(17, 24, 39, 0.8)";
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.titleFont.size = 14;
Chart.defaults.plugins.tooltip.titleFont.weight = "bold";

// Función para mostrar notificaciones
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="bx ${
        type === "success" ? "bx-check-circle" : "bx-x-circle"
      } mr-2"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Función para animar números
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const animate = () => {
    current += increment;
    if (
      (increment > 0 && current >= end) ||
      (increment < 0 && current <= end)
    ) {
      element.textContent = end.toLocaleString("es-ES");
      return;
    }
    element.textContent = Math.round(current).toLocaleString("es-ES");
    requestAnimationFrame(animate);
  };

  animate();
}

// Función para crear gráficos con gradientes
function createGradient(ctx, colors) {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color);
  });
  return gradient;
}

// Función para formatear números como moneda
function formatCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Función para formatear fechas
function formatDate(date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Función para generar datos aleatorios
function generateRandomData(baseValue, count, volatility = 0.02) {
  const data = [];
  let value = baseValue;
  for (let i = 0; i < count; i++) {
    value = value * (1 + (Math.random() - 0.5) * volatility);
    data.push(value);
  }
  return data;
}

// Función para inicializar gráficos
function initializeChart(canvasId, type, data, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const ctx = canvas.getContext("2d");
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return new Chart(ctx, {
    type,
    data,
    options: { ...defaultOptions, ...options },
  });
}

// Datos de criptomonedas
const cryptoData = {
  "BTC/USDT": {
    name: "Bitcoin",
    price: 42150.0,
    change24h: 2.5,
    volume: 28500000000,
  },
  "ETH/USDT": {
    name: "Ethereum",
    price: 2850.0,
    change24h: 3.2,
    volume: 15200000000,
  },
  "SOL/USDT": {
    name: "Solana",
    price: 98.5,
    change24h: 5.8,
    volume: 2800000000,
  },
  "ADA/USDT": {
    name: "Cardano",
    price: 0.45,
    change24h: -1.2,
    volume: 980000000,
  },
  "DOT/USDT": {
    name: "Polkadot",
    price: 6.8,
    change24h: 1.5,
    volume: 750000000,
  },
};

// Manejador de eventos cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar tooltips
  const tooltips = document.querySelectorAll("[data-tooltip]");
  tooltips.forEach((tooltip) => {
    tooltip.addEventListener("mouseenter", (e) => {
      const content = e.target.getAttribute("data-tooltip");
      const tooltipEl = document.createElement("div");
      tooltipEl.className = "tooltip";
      tooltipEl.textContent = content;
      document.body.appendChild(tooltipEl);

      const rect = e.target.getBoundingClientRect();
      tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 10}px`;
      tooltipEl.style.left = `${
        rect.left + (rect.width - tooltipEl.offsetWidth) / 2
      }px`;
    });

    tooltip.addEventListener("mouseleave", () => {
      const tooltip = document.querySelector(".tooltip");
      if (tooltip) tooltip.remove();
    });
  });

  // Animación de números en estadísticas
  const statNumbers = document.querySelectorAll(".stat-number");
  statNumbers.forEach((stat) => {
    const value = parseInt(stat.textContent.replace(/[^0-9]/g, ""));
    animateValue(stat, 0, value, 2000);
  });

  // Manejadores para modales y botones
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const closeLoginBtn = document.getElementById("closeLoginBtn");
  const closeRegisterBtn = document.getElementById("closeRegisterBtn");
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const showLoginBtn = document.getElementById("showLoginBtn");

  // Botones de acción principal
  const startNowBtns = document.querySelectorAll(
    ".modern-button:not(#loginBtn)"
  );
  startNowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.textContent.includes("Demo")) {
        window.location.href = "dashboard.html";
      } else {
        registerModal.classList.remove("hidden");
      }
    });
  });

  // Funciones para modales
  function showModal(modal) {
    modal.classList.remove("hidden");
  }

  function hideModal(modal) {
    modal.classList.add("hidden");
  }

  // Event listeners para modales
  if (loginBtn) {
    loginBtn.addEventListener("click", () => showModal(loginModal));
  }

  if (closeLoginBtn) {
    closeLoginBtn.addEventListener("click", () => hideModal(loginModal));
  }

  if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener("click", () => hideModal(registerModal));
  }

  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", () => {
      hideModal(loginModal);
      showModal(registerModal);
    });
  }

  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", () => {
      hideModal(registerModal);
      showModal(loginModal);
    });
  }

  // Cerrar modales al hacer clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) hideModal(loginModal);
    if (e.target === registerModal) hideModal(registerModal);
  });

  // Manejador del formulario de login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      // Simulación de login
      showNotification("Iniciando sesión...");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    });
  }

  // Manejador del formulario de registro
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const data = Object.fromEntries(formData.entries());

      // Validación de contraseña
      if (data.password !== data.confirmPassword) {
        showNotification("Las contraseñas no coinciden", "error");
        return;
      }

      // Simulación de registro
      showNotification("Creando tu cuenta...");

      setTimeout(() => {
        hideModal(registerModal);
        showNotification("Cuenta creada exitosamente");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      }, 2000);
    });
  }

  // Inicializar gráfico de rendimiento
  const performanceChart = document.getElementById("performanceChart");
  if (performanceChart) {
    const ctx = performanceChart.getContext("2d");
    const gradient = createGradient(ctx, [
      "rgba(79, 70, 229, 0.1)",
      "rgba(79, 70, 229, 0)",
    ]);

    initializeChart(
      "performanceChart",
      "line",
      {
        labels: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return formatDate(date);
        }),
        datasets: [
          {
            label: "Balance del Portfolio",
            data: generateRandomData(25000, 7),
            borderColor: "#4f46e5",
            backgroundColor: gradient,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      {
        scales: {
          y: {
            ticks: {
              callback: (value) => formatCurrency(value),
            },
          },
        },
      }
    );
  }

  // Inicializar gráfico de trading
  const tradingChart = document.getElementById("tradingChart");
  if (tradingChart) {
    const ctx = tradingChart.getContext("2d");
    const gradient = createGradient(ctx, [
      "rgba(79, 70, 229, 0.1)",
      "rgba(79, 70, 229, 0)",
    ]);

    initializeChart(
      "tradingChart",
      "line",
      {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [
          {
            label: "BTC/USDT",
            data: generateRandomData(42000, 24, 0.005),
            borderColor: "#4f46e5",
            backgroundColor: gradient,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      {
        scales: {
          y: {
            ticks: {
              callback: (value) => formatCurrency(value),
            },
          },
        },
      }
    );
  }

  // Inicializar gráfico de distribución
  const distributionChart = document.getElementById("distributionChart");
  if (distributionChart) {
    initializeChart(
      "distributionChart",
      "doughnut",
      {
        labels: [
          "Long Exitosos",
          "Short Exitosos",
          "Long Fallidos",
          "Short Fallidos",
        ],
        datasets: [
          {
            data: [45, 27, 18, 10],
            backgroundColor: ["#10b981", "#6366f1", "#ef4444", "#f59e0b"],
            borderWidth: 0,
          },
        ],
      },
      {
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
      }
    );
  }

  // Inicializar gráfico de rendimiento por par
  const pairPerformanceChart = document.getElementById("pairPerformanceChart");
  if (pairPerformanceChart) {
    initializeChart("pairPerformanceChart", "bar", {
      labels: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT", "DOT/USDT"],
      datasets: [
        {
          label: "ROI %",
          data: [15.2, 12.8, 18.5, 8.9, 11.2],
          backgroundColor: "#4f46e5",
          borderRadius: 8,
        },
      ],
    });
  }

  // Inicializar gráfico de preview
  const previewChart = document.getElementById("previewChart");
  if (previewChart) {
    const ctx = previewChart.getContext("2d");
    const gradient = createGradient(ctx, [
      "rgba(79, 70, 229, 0.2)",
      "rgba(79, 70, 229, 0.1)",
      "rgba(79, 70, 229, 0)",
    ]);

    const data = [41500, 42300, 42100, 42800, 43200, 42900, 43500];
    const annotations = [
      {
        type: "line",
        yMin: 43200,
        yMax: 43200,
        borderColor: "rgba(239, 68, 68, 0.5)",
        borderWidth: 1,
        borderDash: [5, 5],
        label: {
          enabled: true,
          content: "Resistencia",
          position: "right",
        },
      },
      {
        type: "line",
        yMin: 41800,
        yMax: 41800,
        borderColor: "rgba(16, 185, 129, 0.5)",
        borderWidth: 1,
        borderDash: [5, 5],
        label: {
          enabled: true,
          content: "Soporte",
          position: "right",
        },
      },
    ];

    initializeChart(
      "previewChart",
      "line",
      {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        datasets: [
          {
            label: "BTC/USDT",
            data: data,
            borderColor: "#4f46e5",
            backgroundColor: gradient,
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "#4f46e5",
            pointBorderColor: "white",
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBorderWidth: 3,
          },
        ],
      },
      {
        scales: {
          y: {
            ticks: {
              callback: (value) => formatCurrency(value),
            },
            grid: {
              color: "rgba(0, 0, 0, 0.03)",
              drawBorder: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          annotation: {
            annotations: annotations,
          },
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.9)",
            padding: 12,
            cornerRadius: 8,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            displayColors: false,
            callbacks: {
              label: function (context) {
                return `Precio: ${formatCurrency(context.parsed.y)}`;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      }
    );
  }
});
