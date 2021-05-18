$(document).ready(function () {
    var date_input = $('input[name="date"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
        language: 'es',
        format: 'yyyy-mm-dd',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    $.fn.datepicker.dates['es'] = {
        days: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
        daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Hoy",
        clear: "Limpiar",
    };
    date_input.datepicker(options);
});
$(function () {
    var option = {
        language: "es"
    }
    $('.bs-timepicker').timepicker(option);
});
Dropzone.options.frmTarget = {
    autoProcessQueue: false,
    parallelUploads: 10,
    uploadMultiple: true,
    url: '/team/addTarea',
    paramName: "archivo",
    dictDefaultMessage: 'Dropea aquí tus archivos',
    init: function () {
        var myDropzone = this;
        // Update selector to match your button
        $("#button").click(function (e) {
            e.preventDefault();
            myDropzone.processQueue();
        });
        myDropzone.on('sendingmultiple', function (file, xhr, formData) {
            var data = $('#form').serializeArray();
            $.each(data, function (key, el) {
                console.log(el.name, el.value)
                formData.append(el.name, el.value);
            });
            console.log(formData.getAll("time"))
        });
        myDropzone.on("successmultiple", function (file, responseText) {
            location.reload(true);
        });
    }
}