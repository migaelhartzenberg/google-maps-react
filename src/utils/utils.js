const getRandomMapPosition = (map) => {
    if(!map) return

    const bounds = map.getBounds();
    const minLat = bounds.getSouthWest().lat();
    const minLng = bounds.getSouthWest().lng();
    const maxLat = bounds.getNorthEast().lat();
    const maxLng = bounds.getNorthEast().lng();
    const latRange = maxLat - minLat;
    // Note: longitude can span from a positive longitude in the west to a
    // negative one in the east. e.g. 150lng (150E) <-> -30lng (30W) is a large
    // span that covers the whole USA.
    let lngRange = maxLng - minLng;

    if (maxLng < minLng) {
      lngRange += 360;
    }
    return {
      lat: minLat + Math.random() * latRange,
      lng: minLng + Math.random() * lngRange,
    };
  }


export {
    getRandomMapPosition
}