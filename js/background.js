function post(url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: callback
    });
}

function getJSON(url, data, callback) {
    $.getJSON(url, data, callback);
}