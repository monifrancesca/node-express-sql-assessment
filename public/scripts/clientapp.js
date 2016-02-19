$(document).ready(function() {
    $('#submit-animal').on('click', postData);

// submit button clears out the form by looking for any input with the type of text in the inputAnimal id, then putting an empty string into it
    $('#inputAnimal').find('input[type=text]').val('');

});

function postData() {
    event.preventDefault();

    var values = {};
    $.each($('#animalName').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    $.ajax({
        type: 'POST',
        url: '/animal',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });
}



function getData() {
    $.ajax({
        type: 'GET',
        url: '/animal',
        success: function(data) {
            // loop through each animal
            data.forEach(function(animal, i) {
                $('.output').append('<p>' +
                    animal._id +
                    '</p>');
            });

            //$('.domShow').append('<span>' + data[0].name + '</span>');

            //console.log(data);
        }
    });
}
