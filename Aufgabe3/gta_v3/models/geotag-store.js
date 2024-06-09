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
    constructor() {
        this.geoTags = [];
    }

    addGeoTag(geoTag) {
        this.geoTags.push(geoTag);
    }

    removeGeoTag(name) {
        this.geoTags = this.geoTags.filter(tag => tag.name !== name);
    }

    getNearbyGeoTags(latitude, longitude, radius) {
        return this.geoTags.filter(tag => this._isWithinRadius(tag, latitude, longitude, radius));
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        return this.geoTags.filter(tag => 
            this._isWithinRadius(tag, latitude, longitude, radius) &&
            (tag.name.includes(keyword) || tag.hashtag.includes(keyword))
        );
    }

    _isWithinRadius(tag, latitude, longitude, radius) {
        const toRadians = (degree) => degree * (Math.PI / 180);
        const earthRadius = 6371; // km

        const dLat = toRadians(tag.latitude - latitude);
        const dLon = toRadians(tag.longitude - longitude);

        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(latitude)) * Math.cos(toRadians(tag.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance <= radius;
    }
}

module.exports = InMemoryGeoTagStore;
