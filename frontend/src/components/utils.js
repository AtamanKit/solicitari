export function elementPath() {
    const pathnameSplit = window.location.pathname.split('/')
    
    return {
        'type': pathnameSplit[1],
        'typeTwo': pathnameSplit[2],
        'typeThree': pathnameSplit[3],
        'typeFour': pathnameSplit[4],
        'typeFive': pathnameSplit[5],
        'typeSix': pathnameSplit[6],
        'typeSeven': pathnameSplit[7],
        'typeEight': pathnameSplit[8],
        'typeNine': pathnameSplit[9],
    }
}


export function apiUrl() {
    // let url = 'http://64.225.98.236/api'
    let url = ''

    if (process.env.NODE_ENV === 'production') {
        url = window.location.origin + '/api';
    } else {
        url = `${process.env.REACT_APP_API_URL}/api`;
    };

    return url;
}

export function wsUrl() {
    // let url = 'ws://64.225.98.236/ws'
    let url = ''

    if (process.env.NODE_ENV === 'production') {
        let array = window.location.origin.split('://');
        if (array[0] === 'http' || array[0] === 'https') {
            array.splice(0, 1, 'wss')
        }
        url = `${array[0]}://${array[1]}/ws`
    } else {
        url = `${process.env.REACT_APP_WS_URL}/ws`;
    };

    return url;
}

export function textToList(text) {
    let textSlice = text.slice(1);
    textSlice = textSlice.slice(0, textSlice.length - 1);
    textSlice = textSlice.replace(/'/g, '')

    return textSlice.split(',');
}

export function officeAbrUp(office) {
    if (office === 'Ungheni') {
        return 'UN'
    } else if (office === 'Falesti') {
        return 'FL'
    } else if (office === 'Glodeni') {
        return 'GL'
    } else if (office === 'Riscani') {
        return 'RS'
    }
}

export function handleToday() {
    const myDate = new Date();
    const myYear = myDate.getFullYear().toString();
    const myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
    const myDay = ('0' + myDate.getDate()).slice(-2);
    const myHour = ('0' + myDate.getHours()).slice(-2);
    const myMin = ('0' + myDate.getMinutes()).slice(-2);

    const myToday = myDay + '.' + myMonth + '.' + myYear +
                    ' ' + myHour + ':' + myMin

    return {
        fullDate: myToday,
        year: myYear,
        month: myMonth,
        day: myDay,
        hour: myHour,
        minute: myMin,
    };
}
