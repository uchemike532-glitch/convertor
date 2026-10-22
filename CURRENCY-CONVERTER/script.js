 const API_URL = "https://api.frankfurter.dev/v2/rate/usd/eur";

        const usdInput = document.getElementById("usdAmount");
        const eurResult = document.getElementById("eurResult");
        const exchangeRate = document.getElementById("exchangeRate");
        const message = document.getElementById("message");
        const convertButton = document.getElementById("convertButton");

        const eurFormatter = new Intl.NumberFormat("en", {
            style: "currency",
            currency: "EUR"
        });

        const usdFormatter = new Intl.NumberFormat("en", {
            style: "currency",
            currency: "USD"
        });

        let currentRate = null;

        async function getExchangeRate() {
            exchangeRate.textContent = "Fetching latest exchange rate...";
            convertButton.disabled = true;
            message.textContent = "";
            message.className = "message";

            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Unable to fetch exchange rate.");
                }

                const data = await response.json();

                if (typeof data.rate !== "number" ||
                    !Number.isFinite(data.rate) ||
                    data.rate <= 0) {
                    throw new Error("Invalid exchange rate received.");
                }

                currentRate = data.rate;

                exchangeRate.textContent =
                    `1 USD = ${currentRate.toFixed(4)} EUR`;

                convertCurrency();

            } catch (error) {
                exchangeRate.textContent =
                    "Exchange rate unavailable.";

                message.textContent =
                    "Please check your internet connection and try again.";

                message.className = "message error";

                console.error("API error:", error);

            } finally {
                convertButton.disabled = false;
            }
        }

        function convertCurrency() {
            const usd = Number(usdInput.value);

            if (usdInput.value.trim() === "" ||
                !Number.isFinite(usd) ||
                usd < 0) {

                eurResult.textContent = "—";
                message.textContent =
                    "Please enter a valid, non-negative amount.";
                message.className = "message error";

                return;
            }

            if (currentRate === null) {
                message.textContent =
                    "Waiting for the exchange rate to load.";
                message.className = "message";
                return;
            }

            const eur = usd * currentRate;

            eurResult.textContent = eurFormatter.format(eur);

            message.textContent =
                `${usdFormatter.format(usd)} = ${eurFormatter.format(eur)}`;

            message.className = "message";
        }

        // Convert automatically when the amount changes.
        usdInput.addEventListener("input", convertCurrency);

        // Fetch the exchange rate when the page loads.
        getExchangeRate();