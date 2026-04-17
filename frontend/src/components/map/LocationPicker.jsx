import { useEffect, useRef } from 'react';

function LocationPicker({ onSelect }) {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!window.google) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 17.385, lng: 78.4867 },
            zoom: 12
        });

        let marker;

        map.addListener('click', (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            // Remove previous marker
            if (marker) marker.setMap(null);

            marker = new window.google.maps.Marker({
                position: { lat, lng },
                map
            });

            onSelect({ lat, lng });
        });

    }, []);

    return (
        <div
            ref={mapRef}
            className="w-full h-[300px] rounded border"
        />
    );
}

export default LocationPicker;