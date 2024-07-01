const axios = require('axios');

const baseURL = 'http://localhost:3000/api/geotags';

const demonstrateGeoTagLifecycle = async () => {
    try {
        // 1. Erstellen eines neuen Geotags
        const newGeoTag = { name: 'Test Location', latitude: 40.7128, longitude: -74.0060 };
        const createResponse = await axios.post(baseURL, newGeoTag);
        console.log('Created GeoTag:', createResponse.data);

        const createdGeoTag = createResponse.data;

        // 2. Abrufen des erstellten Geotags nach ID
        const getResponse = await axios.get(`${baseURL}/${createdGeoTag.id}`);
        console.log('Retrieved GeoTag:', getResponse.data);

        // 3. Aktualisieren des Geotags
        const updatedGeoTag = { name: 'Updated Location', latitude: 40.730610, longitude: -73.935242 };
        const updateResponse = await axios.put(`${baseURL}/${createdGeoTag.id}`, updatedGeoTag);
        console.log('Updated GeoTag:', updateResponse.data);

        // 4. Abrufen aller Geotags
        const getAllResponse = await axios.get(baseURL);
        console.log('All GeoTags:', getAllResponse.data);

        // 5. Löschen des Geotags
        await axios.delete(`${baseURL}/${createdGeoTag.id}`);
        console.log('Deleted GeoTag with ID:', createdGeoTag.id);

        // 6. Überprüfen, ob der Geotag gelöscht wurde
        const finalGetAllResponse = await axios.get(baseURL);
        console.log('All GeoTags after deletion:', finalGetAllResponse.data);
    } catch (error) {
        console.error('Error during GeoTag lifecycle demonstration:', error);
    }
};

demonstrateGeoTagLifecycle();
