// API keys 
// .gitignore
// chaining calls

// create an event listener
// pull out the value from text boxes
// we want to fetch() it, basically make api call with address & api key
//  https://geocode.maps.co/search?q=${city},tn&api_key=${key} // the ${key} is in it's own file in apiKey.js
// we get the coordinates => make sat api call with coordinates & NORAD code
//  https://sat.terrestre.ar/passes/25544?lat=35.14&lon=-90.05&limit=1
// we get the data on the rise, set, etc => display to html

    document.querySelector('#search').addEventListener('click', () => {
        const location = document.querySelector('#location').value
        const norad = document.querySelector('#norad').value

        if(!location || !norad){
            alert("Please enter both a location and NORAD ID.")
            return
        }

        fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(location)}&api_key=${key}`)
        .then(response => response.json())
        .then(data => {
            if(!data || data.length === 0){
                alert("Location not found.")
                return
            }
            const lat = data[0].lat
            const lon = data[0].lon

            fetch(`https://sat.terrestre.ar/passes/${norad}?lat=${lat}&lon=${lon}&limit=1`)
                .then(response => response.json())
                .then(passData => {
                    if(!passData || passData.length === 0){
                        alert("NO satellite pass found.")
                        return
                    }

                    const nextPass = passData[0]
                    const riseTime = new Date(nextPass.rise.utc_datetime).toLocaleString()
                    const setTime = new Date(nextPass.set.utc_datetime).toLocaleString()
                    const duration = Math.round(nextPass.duration)

                    alert(
                        `Next Satellite Pass Info:\n\n` +
                        `Location: ${location}\n NORAD ID: ${norad}\n\n` +
                        `Rise Time: ${riseTime}\n Set Time: ${setTime}\n Duration: ${duration} seconds`
                    )
                })
                .catch(error => {
                    console.error("Error fetching satellite data:", error)
                    alert("Could not get satellite pass info.")
                })
        })
        .catch(error => {
            console.error('Error fetching location:', error)
            alert("Something went wrong finding the location")
        })
    })