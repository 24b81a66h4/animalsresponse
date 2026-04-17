import { useEffect, useRef } from 'react';

function MapView({ lat = 17.385, lng = 78.4867 }) {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!window.google) return;

        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: 12
        });

        new window.google.maps.Marker({
            position: { lat, lng },
            map
        });

    }, [lat, lng]);

    return (
        <div
            ref={mapRef}
            className="w-full h-[300px] rounded"
        />
    );
}

export default MapView;