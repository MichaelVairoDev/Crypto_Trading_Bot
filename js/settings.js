document.addEventListener("DOMContentLoaded", function () {
  // Referencias a los formularios
  const apiForm = document.getElementById("apiForm");
  const notificationForm = document.getElementById("notificationForm");
  const riskForm = document.getElementById("riskForm");
  const exportBtn = document.querySelector(".export-btn");
  const importBtn = document.querySelector('.import-btn input[type="file"]');

  // Cargar configuración guardada
  loadSavedSettings();

  // Manejadores de eventos para los formularios
  apiForm.addEventListener("submit", handleApiFormSubmit);
  notificationForm.addEventListener("submit", handleNotificationFormSubmit);
  riskForm.addEventListener("submit", handleRiskFormSubmit);
  exportBtn.addEventListener("click", handleExportConfig);
  importBtn.addEventListener("change", handleImportConfig);

  // Manejar cambios en los toggles de notificaciones
  const emailToggle = document.querySelector('[name="emailNotifications"]');
  const telegramToggle = document.querySelector(
    '[name="telegramNotifications"]'
  );
  const emailInput = document.querySelector('[name="emailAddress"]');
  const telegramInput = document.querySelector('[name="telegramId"]');

  emailToggle.addEventListener("change", function () {
    emailInput.disabled = !this.checked;
    if (!this.checked) emailInput.value = "";
  });

  telegramToggle.addEventListener("change", function () {
    telegramInput.disabled = !this.checked;
    if (!this.checked) telegramInput.value = "";
  });

  // Función para cargar la configuración guardada
  function loadSavedSettings() {
    try {
      // Cargar configuración de API
      const apiConfig = JSON.parse(localStorage.getItem("apiConfig")) || {};
      if (apiConfig.exchange) {
        apiForm.exchange.value = apiConfig.exchange;
        apiForm.apiKey.value = "********"; // Por seguridad
      }

      // Cargar configuración de notificaciones
      const notificationConfig =
        JSON.parse(localStorage.getItem("notificationConfig")) || {};
      if (notificationConfig.email) {
        emailToggle.checked = true;
        emailInput.value = notificationConfig.email;
      }
      if (notificationConfig.telegram) {
        telegramToggle.checked = true;
        telegramInput.value = notificationConfig.telegram;
      }

      // Cargar configuración de riesgo
      const riskConfig = JSON.parse(localStorage.getItem("riskConfig")) || {};
      if (riskConfig.maxRisk) {
        riskForm.maxRiskPercentage.value = riskConfig.maxRisk;
        riskForm.maxSimultaneousTrades.value = riskConfig.maxTrades;
        riskForm.globalStopLoss.value = riskConfig.globalStopLoss;
      }
    } catch (error) {
      console.error("Error al cargar la configuración:", error);
      showNotification("Error al cargar la configuración", "error");
    }
  }

  // Manejador para el formulario de API
  async function handleApiFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const config = {
      exchange: formData.get("exchange"),
      apiKey: formData.get("apiKey"),
      apiSecret: formData.get("apiSecret"),
    };

    try {
      // Aquí se implementaría la validación de las credenciales de API
      await validateApiCredentials(config);

      // Guardar configuración
      localStorage.setItem(
        "apiConfig",
        JSON.stringify({
          exchange: config.exchange,
          // No guardamos las claves API por seguridad
        })
      );

      showNotification("Credenciales de API guardadas exitosamente", "success");
    } catch (error) {
      console.error("Error al guardar credenciales:", error);
      showNotification("Error al guardar credenciales de API", "error");
    }
  }

  // Manejador para el formulario de notificaciones
  function handleNotificationFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const config = {
      email: formData.get("emailAddress"),
      telegram: formData.get("telegramId"),
      notifications: {
        trades: formData.get("tradeNotifications") === "on",
        profit: formData.get("profitNotifications") === "on",
        loss: formData.get("lossNotifications") === "on",
        error: formData.get("errorNotifications") === "on",
      },
    };

    try {
      localStorage.setItem("notificationConfig", JSON.stringify(config));
      showNotification("Configuración de notificaciones guardada", "success");
    } catch (error) {
      console.error("Error al guardar notificaciones:", error);
      showNotification(
        "Error al guardar configuración de notificaciones",
        "error"
      );
    }
  }

  // Manejador para el formulario de riesgo
  function handleRiskFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const config = {
      maxRisk: formData.get("maxRiskPercentage"),
      maxTrades: formData.get("maxSimultaneousTrades"),
      globalStopLoss: formData.get("globalStopLoss"),
    };

    try {
      localStorage.setItem("riskConfig", JSON.stringify(config));
      showNotification("Configuración de riesgo guardada", "success");
    } catch (error) {
      console.error("Error al guardar configuración de riesgo:", error);
      showNotification("Error al guardar configuración de riesgo", "error");
    }
  }

  // Función para exportar configuración
  function handleExportConfig() {
    try {
      const config = {
        api: JSON.parse(localStorage.getItem("apiConfig")) || {},
        notifications:
          JSON.parse(localStorage.getItem("notificationConfig")) || {},
        risk: JSON.parse(localStorage.getItem("riskConfig")) || {},
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `crypto_bot_config_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification("Configuración exportada exitosamente", "success");
    } catch (error) {
      console.error("Error al exportar configuración:", error);
      showNotification("Error al exportar configuración", "error");
    }
  }

  // Función para importar configuración
  function handleImportConfig(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const config = JSON.parse(e.target.result);

        // Validar estructura del archivo
        if (!validateConfigStructure(config)) {
          throw new Error("Estructura de configuración inválida");
        }

        // Guardar configuración
        if (config.api)
          localStorage.setItem("apiConfig", JSON.stringify(config.api));
        if (config.notifications)
          localStorage.setItem(
            "notificationConfig",
            JSON.stringify(config.notifications)
          );
        if (config.risk)
          localStorage.setItem("riskConfig", JSON.stringify(config.risk));

        // Recargar configuración
        loadSavedSettings();
        showNotification("Configuración importada exitosamente", "success");
      } catch (error) {
        console.error("Error al importar configuración:", error);
        showNotification("Error al importar configuración", "error");
      }
    };
    reader.readAsText(file);
  }

  // Función para validar credenciales de API
  async function validateApiCredentials(config) {
    // Aquí se implementaría la validación real con el exchange
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  // Función para validar estructura de configuración importada
  function validateConfigStructure(config) {
    return (
      typeof config === "object" &&
      (!config.api || typeof config.api === "object") &&
      (!config.notifications || typeof config.notifications === "object") &&
      (!config.risk || typeof config.risk === "object")
    );
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
});
