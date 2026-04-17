const axios = require('axios');

const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

const getAddressFromCoords = async (lat, lng) => {
    try {
        const res = await axios.get(GEOCODE_URL, {
            params: {
                latlng: `${lat},${lng}`,
                key: process.env.GOOGLE_MAPS_KEY
            }
        });

        return res.data.results[0]?.formatted_address || "Unknown Location";
    } catch (error) {
        console.error("❌ Maps Error:", error.message);
        return null;
    }
};

module.exports = {
    getAddressFromCoords
};