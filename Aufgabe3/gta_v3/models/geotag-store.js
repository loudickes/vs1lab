// geotag-store.js

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */

const GeoTag = require('./geotag');

class InMemoryGeoTagStore {
    // Constructor to initialize the geotag store.
    constructor() {
        // Initialize an empty array to store the geotags.
        this.geotags = [];
    }

    /**
     * Adds a geotag to the store.
     * @param {GeoTag} geotag - The geotag to add
     */
    addGeoTag(geotag) {
        // Add the given geotag to the array.
        this.geotags.push(geotag);
    }

    /**
     * Removes a geotag from the store by name.
     * @param {string} name - The name of the geotag to remove
     */
    removeGeoTag(name) {
        // Filter the array to remove the geotag with the specified name.
        this.geotags = this.geotags.filter(tag => tag.name !== name);
    }

    /**
     * Returns all geotags in the proximity of a location.
     * @param {number} latitude - The latitude of the location
     * @param {number} longitude - The longitude of the location
     * @param {number} radius - The radius to search within
     * @returns {GeoTag[]} - Array of geotags in proximity
     */
    getNearbyGeoTags(latitude, longitude, radius = 1) {
        return this.geoTags.filter(tag => this._getDistance(tag.latitude, tag.longitude, latitude, longitude) <= radius);
    }

    /**
     * Returns all geotags in the proximity of a location that match a keyword.
     * @param {number} latitude - The latitude of the location
     * @param {number} longitude - The longitude of the location
     * @param {number} radius - The radius to search within
     * @param {string} keyword - The keyword to search for
     * @returns {GeoTag[]} - Array of geotags matching the keyword in proximity
     */
    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        return this.getNearbyGeoTags(latitude, longitude, radius).filter(tag => tag.name.includes(keyword) || tag.hashtag.includes(keyword));
    }

    _getDistance(lat1, lon1, lat2, lon2) {
        const toRad = x => x * Math.PI / 180;
        const R = 6371; // Radius of the Earth in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }
}

module.exports = InMemoryGeoTagStore;
