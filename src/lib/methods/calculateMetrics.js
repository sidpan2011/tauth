export const calculateMetrics = (data) => {
    const metrics = {
        dwellTimes: [],      // Time between press and release of same key
        flightTimes: [],     // Time between release of one key and press of next
        upToUpTimes: [],     // Time between consecutive key releases
        downToDownTimes: [], // Time between consecutive key presses
    }

    let lastKeyUp = null
    let lastKeyDown = null
    let pressedKeys = new Map() // Using Map to track pressed keys with their timestamps

    // Filter out modifier keys and sort by timestamp
    const sortedEvents = [...data]
        .filter(event => !['Shift', 'Control', 'Alt', 'Meta'].includes(event.key))
        .sort((a, b) => a.time - b.time)

    sortedEvents.forEach(event => {
        console.log("This is event",event);
        if (event.eventType === "keydown") {
            // Store press time for dwell time calculation
            pressedKeys.set(event.key, event.time)
            
            // Calculate down-to-down time (between consecutive presses)
            if (lastKeyDown && lastKeyDown.key !== event.key) { // Added check for different keys
                metrics.downToDownTimes.push({
                    firstKey: lastKeyDown.key,
                    secondKey: event.key,
                    time: event.time - lastKeyDown.time,
                    position: event.position
                })
            }
            
            // If there was a previous keyup, calculate flight time
            if (lastKeyUp && lastKeyUp.key !== event.key) { // Added check for different keys
                metrics.flightTimes.push({
                    firstKey: lastKeyUp.key,
                    secondKey: event.key,
                    time: event.time - lastKeyUp.time,
                    position: event.position
                })
            }

            lastKeyDown = event
        }
        else if (event.eventType === "keyup") {
            const pressTime = pressedKeys.get(event.key)
            if (pressTime) {
                // Calculate dwell time only if we have a corresponding keydown
                metrics.dwellTimes.push({
                    key: event.key,
                    time: event.time - pressTime,
                    position: event.position
                })
                pressedKeys.delete(event.key)
            }

            // Calculate up-to-up time
            if (lastKeyUp && lastKeyUp.key !== event.key) { // Added check for different keys
                metrics.upToUpTimes.push({
                    firstKey: lastKeyUp.key,
                    secondKey: event.key,
                    time: event.time - lastKeyUp.time,
                    position: event.position
                })
            }

            lastKeyUp = event
        }
    })


    return {
        rawMetrics: metrics,
        totalEvents: sortedEvents.length,
        uniqueKeys: new Set(sortedEvents.map(event => event.key)).size
    }
}