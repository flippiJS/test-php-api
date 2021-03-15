var app = new function () {
    this.url = '';
    this.method = 'GET';
    this.headers = {};
    this.payload = {};
    this.response = {};

    // Metodo generico para reutilizar llamada
    this.httpService = function (path, method, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, this.URL + path, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function () {
            var status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response);
            } else {
                callback(status, xhr.response);
            }
        };
        xhr.send(data);
    };

    // Hacemos la llamada para obtener las respuesta
    this.doRequest = function () {
        that = this; // Guardamos scope
        showLoading(true);
        this.httpService(this.url, this.method, null, function (err, data) {
            showLoading(false);
            that.response = data;
        });
    };


    this.onAbrirPopUp = function (item) {
        MostrarEditar();
        // Configuramos los botones
        document.getElementById("iBtnModificar").setAttribute("onclick", 'app.Modificar(' + this.materias[item].id + ',' + item + ')');
        document.getElementById("iBtnEliminar").setAttribute("onclick", 'app.Borrar(' + this.materias[item].id + ',' + item + ')');

        // Setemaos los datos de la materia
        document.getElementById("iNombre").value = this.materias[item].nombre;

        var select = document.getElementById("iCuatrimestre");
        select.options[this.materias[item].cuatrimestre].selected = true;

        document.getElementById("iCuatrimestre").disabled = true;
        document.getElementById("iMañana").checked = (this.materias[item].turno === 'Mañana');
        document.getElementById("iNoche").checked = (this.materias[item].turno === 'Noche');
        document.getElementById("iFecha").value = DateToHTMLFormat(StringToDate(this.materias[item].fechaFinal));
    }
}
// Inicializamos
//app.init();

function cleanInputs() {
    document.getElementById('spoiler').style.display = 'none';
}

function showLoading(bool) {
    if (bool) {
        document.getElementById('loading').classList.remove("d-none");
        document.getElementById('loading').classList.add("d-block");
    } else {
        document.getElementById('loading').classList.remove("d-block");
        document.getElementById('loading').classList.add("d-none");
    }
}
