<!-- to upload shp zip files -->
<script src="js/jszip.min.js"></script>
<script src="https://unpkg.com/shapefile@0.6"></script>

fetch("data/shp.zip")
    .then(function (response) {
        return response.blob();
    })
    .then(function (blob) {
        return JSZip.loadAsync(blob);
    })
    .then((zip) => {
        const promises = [];
        zip.forEach((relativePath, file) => {
            if (/\.shp$/.test(relativePath)) {
                const promise = file.async('arraybuffer')
                    .then((buffer) => {
                        return shapefile.read(buffer);
                    })
                // .then((geojson) => {
                // console.log('file', file.name);
                // console.log(geojson); // Do something with the GeoJSON
                // });
                promises.push(promise);
            }
        });
        return Promise.all(promises);
    })
    .then(data => {
        console.log('data------->', data);
    })

map.addSource('points', {
    'type': 'geojson',
    'data': {
        'type': 'FeatureCollection',
        'features': []
    }
})
map.addLayer({
    'id': 'circle',
    'type': 'circle',
    'source': 'points',
    'paint': {
        'circle-color': '#4264fb',
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
    }
});