export const fetchCountryData = async () => {
    try {
        const response = await fetch("https://covid19-api.com/country/all?format=json", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
                "x-rapidapi-key": "9679906c17msh7b64bbe305ba4fbp1fcfa4jsna943f2f533e0",
            },
        });

        if (response.ok) {
            const json = await response.json();
            console.log("COUNTRY DATA: ", json);
            return json;
        }
    } catch (error) {
        console.error("ERROR FETCHING COUNTRY DATA: ", error);
    }
};

export const fetchTotalsData = async () => {
    try {
        const response = await fetch("https://covid19-api.com/totals?format=json", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
                "x-rapidapi-key": "9679906c17msh7b64bbe305ba4fbp1fcfa4jsna943f2f533e0",
            },
        });

        if (response.ok) {
            const json = await response.json();
            console.log("TOTALS: ", json);
            return json;
        }
    } catch (error) {
        console.error("ERROR FETCHING TOTALS DATA: ", error);
    }
};