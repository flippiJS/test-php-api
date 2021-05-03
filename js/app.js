var app = new function () {
    this.url = '';
    this.method = 'GET';
    this.headers = [];
    this.payload = {};
    this.response = {};
    this.error = {};

    // Metodo generico para reutilizar llamada
    this.httpService = function (callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(this.method, this.url.trim(), true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function () {
            var status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response, xhr);
            } else {
                callback(status, xhr.response, xhr);
            }
        };
        xhr.onerror = function (e) {
            callback(e.target.status, null, e.target);
        };
        xhr.send(this.payload);
    };

    // Hacemos la llamada para obtener las respuesta
    this.doRequest = function () {
        that = this; // Guardamos scope
        showLoading(true);
        this.httpService(function (err, data, xhr) {
            showLoading(false);
            that.response = data;
            that.error = err;
            console.log(err, data);
            that.processResponse(err, data, xhr);
        });
    };

    this.getUserInput = function () {
        this.url = document.getElementById("iUrl").value || '';
        this.method = document.getElementById("iMethod").value || 'GET';
        this.headers = document.getElementById("iHeaders").value || [];
        this.payload = document.getElementById("iPayload").value || {};
        if (this.url !== '') this.doRequest();
    };

    this.processResponse = function (err, data, xhr) {
        console.log(xhr);
        if(xhr && xhr.status) document.getElementById("iStatus").innerHTML = xhr.status;
        if(xhr && xhr.status === 0) document.getElementById("iStatus").innerHTML = xhr.status;
        if(xhr && xhr.response) document.getElementById("iBody").innerHTML = JSON.stringify(xhr.response, undefined, 4);
    }

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
        document.getElementById('iAction').classList.add("d-none");
        document.getElementById('iAction').classList.remove("d-block");
        document.getElementById('iLoading').classList.remove("d-none");
        document.getElementById('iLoading').classList.add("d-block");
    } else {
        document.getElementById('iAction').classList.add("d-block");
        document.getElementById('iAction').classList.remove("d-none");
        document.getElementById('iLoading').classList.remove("d-block");
        document.getElementById('iLoading').classList.add("d-none");
    }
}
