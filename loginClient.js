const formE1 = document.querySelector('.form');

/*---
Intercepta el submit del formulario
*/
formE1.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(formE1);
    const data = Object.fromEntries(formData);
    console.log('Revisa el valor del form');
    console.log(data);

    /*---
    Realiza validaciones en los datos del formulario antes de procesar
    */

    if (data.contacto == '' || data.password == '') { // Cambiar a "contacto" en vez de "username"
        console.log('Debe indicar correo electrónico');
        document.getElementById('resultado').style.color = "RED";
        document.getElementById('resultado').style.textAlign = "center";
        document.getElementById('resultado').textContent = 'Debe informar correo electrónico y password para completar el acceso';
        return;
    }

    if (data.contacto == 'pec') {  // Cambiar a "contacto" en vez de "username"
        console.log('pec no es bienvenido en este sistema');
        const m = `<li>El usuario <pec> no es bienvenido en este sistema</li>`;
        document.getElementById('resultado').style.color = "RED";
        document.getElementById('resultado').style.textAlign = "center";
        document.getElementById('resultado').textContent = 'El usuario <pec> no es bienvenido en este sistema';
        return;
    }

    if (data.termscondition != 'on') {
        console.log('No aceptó los T&C, no se puede loggear');
        document.getElementById('resultado').style.color = "RED";
        document.getElementById('resultado').style.textAlign = "center";
        document.getElementById('resultado').textContent = 'Debe aceptar los T&C para poder usar el sistema';
        return;
    }

    /*---
    Genera objeto HTML a ser actualizado en el tag identificado como "app"
    */

    const HTMLResponse = document.querySelector("#app");
    const ul = document.createElement("ul");

    const tpl = document.createDocumentFragment();

    const systemURL = {
        listarTicket: "http://127.0.0.1:5500/listarTicket.html",
        addTicket: "http://127.0.0.1:5500/addTicket.html",
        updateTicket: "http://127.0.0.1:5500/updateTicket.html",
        loginCliente: "http://127.0.0.1:5500/loginClient.html",
        updateCliente: "http://127.0.0.1:5500/updateCliente.html",
        addCliente: "http://127.0.0.1:5500/addCliente.html",
        resetCliente: "http://127.0.0.1:5500/resetCliente.html"
    };

    const RESTAPI = {
        loginCliente: "http://127.0.0.1:8080/api/loginCliente",
        listarTicket: "http://localhost:8080/api/listarTicket",
        addCliente: "http://localhost:8080/api/addCliente",
        getTicket: "http://localhost:8080/api/getTicket",
        updateTicket: "http://localhost:8080/api/updateTicket",
        getCliente: "http://localhost:8080/api/getCliente",
        updateCliente: "http://localhost:8080/api/updateCliente",
        listCliente: "http://localhost:8080/api/listarClientes",
        loginClienteEmail: "http://localhost:8080/api/loginClienteEmail"
    };

    /*-----
    Crea estructuras para acceder a data del cliente
    */
    const login = {
        "contacto": data.contacto,  // Usar "contacto" en vez de "username"
        "password": data.password
    };

    const options = {
        method: 'GET',  // Cambia de POST a GET
        headers: {
            'Content-Type': 'application/json',
        },
    };


    console.log("API REST:" + RESTAPI.loginClienteEmail);
    console.log(login);
    console.log("login(" + JSON.stringify(login) + ")");
    console.log("options " + JSON.stringify(options));

    /*-----
    Define el URI para realizar el acceso
    */
    var API = `${RESTAPI.loginClienteEmail}?contacto=${data.contacto}&password=${data.password}`;

    var APIoptions = options;

    /*---- Typicode utilizar id 803a62c8-78c8-4b63-9106-73af216d504b -------*/

    const tipycode = false;
    if (tipycode == true) {
        console.log("Acceso usando Typicode como application server");
        API = "https://my-json-server.typicode.com/lu7did/MesaAyuda/posts/" + data.contacto;
        APIoptions = { method: 'GET' };
    }

    /*-----
    Realiza el acceso al API Rest utilizando gestión de sincronización mediante promesas
    */
    fetch(`${API}`, APIoptions)
        .then(res => {
            if (!res.ok) {
                throw new Error('Error en la respuesta del servidor: ' + res.statusText);
            }
            return res.json();
        })
        .then(users => {
            console.log("Respuesta de la API:", JSON.stringify(users));
            if (users.response == 'OK') {
                document.getElementById('resultado').style.color = "BLACK";
                document.getElementById('resultado').textContent = 'Bienvenido al sistema ' + users.nombre + ', ultimo ingreso ' + users.fecha_ultimo_ingreso;
                window.location.href = systemURL.listarTicket + "?id=" + users.id + "&contacto=" + users.contacto + "&nombre=" + users.nombre + "&fecha_ultimo_ingreso=" + users.fecha_ultimo_ingreso;
            }
             else {
                console.log('La password no es correcta o el login falló.');
                document.getElementById('resultado').style.color = "RED";
                document.getElementById('resultado').textContent = 'Error de login, intente nuevamente';
            }

        })
        .catch(error => {
            console.error('Error en la comunicación con el servidor:', error);
            document.getElementById('resultado').style.color = "RED";
            document.getElementById('resultado').textContent = 'Error en la comunicación con el servidor, intente nuevamente';
        });

});

