export const calculateMetrics = (data) => {
    const metrics = {
        dwellTimes: [],      // Time between press and release of same key
        flightTimes: [],     // Time between release of one key and press of next
        upToUpTimes: [],     // Time between consecutive key releases
        downToDownTimes: [], // Time between consecutive key presses
        wpm: 0,              // Words per minute
    }

    let lastKeyUp = null
    let lastKeyDown = null
    let pressedKeys = new Map() // Using Map to track pressed keys with their timestamps

    // Filter out modifier keys and sort by timestamp
    const sortedEvents = [...data]
        .filter(event => !['Shift', 'Control', 'Alt', 'Meta'].includes(event.key))
        .sort((a, b) => a.time - b.time)
    if (sortedEvents.length > 0) {
        const startTime = sortedEvents[0].time
        const endTime = sortedEvents[sortedEvents.length - 1].time
        const timeInMins = (endTime - startTime) / 60000 // ms to mins
        const charCount = sortedEvents.filter(event => event.eventType === "keydown" && event.key.length === 1).length
        metrics.wpm = timeInMins > 0 ? Math.round(charCount / 5 / timeInMins) : 0
    }
    sortedEvents.forEach(event => {
        console.log("This is event",event);
        if (event.eventType === "keydown") {
            // Store press time for dwell time calculation
            pressedKeys.set(event.key, event.time)
            
            // Calculate down-to-down time
            if (lastKeyDown && lastKeyDown.key !== event.key) { // Added check for different keys
                const timeFloat64 = new Float64Array([event.time - lastKeyDown.time])
                metrics.downToDownTimes.push({
                    firstKey: lastKeyDown.key,
                    secondKey: event.key,
                    time: timeFloat64[0],
                    position: event.position
                })
            }
            
            // calculate flight time
            if (lastKeyUp && lastKeyUp.key !== event.key) { // Added check for different keys
                const timeFloat64 = new Float64Array([event.time - lastKeyUp.time])
                metrics.flightTimes.push({
                    firstKey: lastKeyUp.key,
                    secondKey: event.key,
                    time: timeFloat64[0],
                    position: event.position
                })
            }

            lastKeyDown = event
        }
        else if (event.eventType === "keyup") {
            const pressTime = pressedKeys.get(event.key)
            if (pressTime) {
                // Calculate dwell time
                const timeFloat64 = new Float64Array([event.time - pressTime])
                metrics.dwellTimes.push({
                    key: event.key,
                    time: timeFloat64[0],
                    position: event.position
                })
                pressedKeys.delete(event.key)
            }

            // Calculate up-to-up time
            if (lastKeyUp && lastKeyUp.key !== event.key) { // Added check for different keys
                const timeFloat64 = new Float64Array([event.time - lastKeyUp.time])
                metrics.upToUpTimes.push({
                    firstKey: lastKeyUp.key,
                    secondKey: event.key,
                    time: timeFloat64[0],
                    position: event.position
                })
            }

            lastKeyUp = event
        }
    })
    const convertMetricsToFloat64 = {
        dwellTimes: Array.from(new Float64Array(metrics.dwellTimes.map(item => item.time))),
        flightTimes: Array.from(new Float64Array(metrics.flightTimes.map(item => item.time))),
        upToUpTimes: Array.from(new Float64Array(metrics.upToUpTimes.map(item => item.time))),
        downToDownTimes: Array.from(new Float64Array(metrics.downToDownTimes.map(item => item.time)))
    }


    return {
        rawMetrics: convertMetricsToFloat64,
        wpm: metrics.wpm,
        totalEvents: sortedEvents.length,
        uniqueKeys: new Set(sortedEvents.map(event => event.key)).size
    }
}