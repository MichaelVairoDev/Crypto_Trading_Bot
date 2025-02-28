document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
  const botStatusValue = document.querySelector(".status-value");
  const toggleBotButton = document.querySelector(".toggle-bot");
  const strategyForm = document.getElementById("strategy-form");
  const saveConfigButton = document.querySelector(".save-config");
  const testConfigButton = document.querySelector(".test-config");

  // Estado inicial del bot
  let isBotRunning = true;

  // Manejador para toggle del bot
  toggleBotButton.addEventListener("click", function () {
    isBotRunning = !isBotRunning;
    updateBotStatus();
  });

  // Función para actualizar el estado visual del bot
  function updateBotStatus() {
    if (isBotRunning) {
      botStatusValue.textContent = "Activo";
      botStatusValue.className = "status-value running";
      toggleBotButton.textContent = "Detener Bot";
      toggleBotButton.style.backgroundColor = "var(--danger-color)";
    } else {
      botStatusValue.textContent = "Detenido";
      botStatusValue.className = "status-value stopped";
      toggleBotButton.textContent = "Iniciar Bot";
      toggleBotButton.style.backgroundColor = "var(--success-color)";
    }
  }

  // Manejador para guardar configuración
  saveConfigButton.addEventListener("click", function () {
    const formData = new FormData(strategyForm);
    const config = {
      tradingPair: formData.get("tradingPair"),
      strategyType: formData.get("strategyType"),
      positionSize: parseFloat(formData.get("positionSize")),
      stopLoss: parseFloat(formData.get("stopLoss")),
      takeProfit: parseFloat(formData.get("takeProfit")),
      indicators: {
        ema: {
          fast: parseInt(document.querySelector('[name="fastEMA"]').value),
          slow: parseInt(document.querySelector('[name="slowEMA"]').value),
        },
        rsi: {
          period: parseInt(document.querySelector('[name="rsiPeriod"]').value),
          overbought: parseInt(
            document.querySelector('[name="rsiOverbought"]').value
          ),
          oversold: parseInt(
            document.querySelector('[name="rsiOversold"]').value
          ),
        },
      },
      ml: {
        model: document.querySelector('[name="mlModel"]').value,
        trainingWindow: parseInt(
          document.querySelector('[name="trainingWindow"]').value
        ),
        retrainingFrequency: parseInt(
          document.querySelector('[name="retrainingFrequency"]').value
        ),
      },
    };

    // Guardar configuración
    saveConfiguration(config);
  });

  // Función para guardar la configuración
  async function saveConfiguration(config) {
    try {
      // Aquí se implementaría la llamada a la API para guardar la configuración
      console.log("Guardando configuración:", config);

      // Simulación de guardado exitoso
      showNotification("Configuración guardada exitosamente", "success");
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      showNotification("Error al guardar la configuración", "error");
    }
  }

  // Manejador para prueba de backtesting
  testConfigButton.addEventListener("click", async function () {
    const formData = new FormData(strategyForm);
    const config = {
      tradingPair: formData.get("tradingPair"),
      strategyType: formData.get("strategyType"),
      // ... obtener resto de la configuración ...
    };

    try {
      // Aquí se implementaría la llamada a la API de backtesting
      console.log("Iniciando backtesting con configuración:", config);

      // Simulación de backtesting
      showNotification(
        "Backtesting iniciado. Esto puede tomar unos minutos...",
        "info"
      );

      // Simulación de resultados después de 3 segundos
      setTimeout(() => {
        const results = {
          totalTrades: 150,
          winRate: 65.3,
          profitFactor: 1.8,
          maxDrawdown: 12.5,
        };
        showBacktestingResults(results);
      }, 3000);
    } catch (error) {
      console.error("Error en backtesting:", error);
      showNotification("Error al ejecutar backtesting", "error");
    }
  });

  // Función para mostrar resultados de backtesting
  function showBacktestingResults(results) {
    const resultsHTML = `
            <div class="backtest-results">
                <h3>Resultados del Backtesting</h3>
                <div class="results-grid">
                    <div class="result-item">
                        <span class="label">Total de Operaciones:</span>
                        <span class="value">${results.totalTrades}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Tasa de Éxito:</span>
                        <span class="value">${results.winRate}%</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Factor de Beneficio:</span>
                        <span class="value">${results.profitFactor}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Máximo Drawdown:</span>
                        <span class="value">${results.maxDrawdown}%</span>
                    </div>
                </div>
            </div>
        `;

    // Crear y mostrar modal con resultados
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
            <div class="modal-content">
                ${resultsHTML}
                <button class="close-modal">Cerrar</button>
            </div>
        `;

    document.body.appendChild(modal);

    // Cerrar modal
    modal.querySelector(".close-modal").addEventListener("click", () => {
      modal.remove();
    });

    // Agregar estilos dinámicos para el modal
    const style = document.createElement("style");
    style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .modal-content {
                background: white;
                padding: 20px;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
            }

            .backtest-results h3 {
                margin-bottom: 20px;
                color: var(--text-color);
            }

            .results-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }

            .result-item {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .result-item .label {
                color: var(--text-color);
                font-size: 0.9rem;
            }

            .result-item .value {
                font-size: 1.2rem;
                font-weight: bold;
                color: var(--primary-color);
            }

            .close-modal {
                margin-top: 20px;
                padding: 8px 16px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            }

            .close-modal:hover {
                background: var(--secondary-color);
            }
        `;
    document.head.appendChild(style);
  }

  // Función para mostrar notificaciones
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Agregar estilos dinámicos para las notificaciones
    const style = document.createElement("style");
    style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .notification.success {
                background-color: var(--success-color);
            }

            .notification.error {
                background-color: var(--danger-color);
            }

            .notification.info {
                background-color: var(--primary-color);
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remover notificación después de 3 segundos
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 3000);
  }

  // Validación de formularios
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (this.value < parseFloat(this.min)) {
        this.value = this.min;
      }
    });
  });
});
