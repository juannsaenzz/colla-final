async function showClients() {
    try {
        const response = await fetch('http://localhost:8080/api/listCliente');
        const data = await response.json();

        if (data.response === "OK") {
            const clients = data.data;

            const tableContainer = document.getElementById('clientsTableContainer');
            const tbody = document.querySelector('#clientsTable tbody');
            //limpia la tabla
            tbody.innerHTML = '';

            //recorre la resp del servicio y llena la tabla
            clients.forEach(cliente => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cliente.nombre}</td>
                    <td>${cliente.contacto || '-'}</td>
                    <td>${cliente.fecha_ultimo_ingreso}</td>
                    <td>${cliente.activo ? 'Sí' : 'No'}</td>
                    <td>${cliente.registrado ? 'Sí' : 'No'}</td>
                    <td>${cliente.fecha_alta}</td>
                    <td>${cliente.id}</td>
                `;
                tbody.appendChild(row);
            });
            //Muestra l atabla
            tableContainer.classList.remove('hidden');
        } else {
            alert('Error al obtener la lista de clientes');
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        alert('Hubo un problema al obtener los clientes');
    }
}