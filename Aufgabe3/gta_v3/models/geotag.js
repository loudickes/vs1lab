// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
       /**
     * Constructs a new GeoTag object.
     * 
     * @param {number} latitude - The latitude of the GeoTag.
     * @param {number} longitude - The longitude of the GeoTag.
     * @param {string} name - The name of the GeoTag.
     * @param {string} hashtag - The hashtag associated with the GeoTag.
     */

    constructor(latitude, longitude, name, hashtag) {
        this.latitude = parseFloat(latitude);
        this.longitude = parseFloat(longitude);
        this.name = name;
        this.hashtag = hashtag;
    }
    
}

module.exports = GeoTag;
