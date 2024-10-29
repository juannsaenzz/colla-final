async function showTickets() {
    try {
        const response = await fetch('http://localhost:8080/api/listTicket'); // Cambia esto a la URL de tu API
        const data = await response.json();

        if (data.response === "OK") {
            const tickets = data.data;

            const tableContainer = document.getElementById('ticketsTableContainer');
            const tbody = document.querySelector('#ticketsTable tbody');
            // limpia la tabla
            tbody.innerHTML = '';

            // recorre la resp del servicio y llena la tabla
            tickets.forEach(ticket => {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${ticket.id}</td>
                            <td>${ticket.clienteID || '-'}</td>
                            <td>${ticket.estado_solucion || '-'}</td>
                            <td>${ticket.solucion || '-'}</td>
                            <td>${ticket.descripcion || '-'}</td>
                            <td>${ticket.fecha_apertura || '-'}</td>
                            <td>${ticket.ultimo_contacto || '-'}</td>
                        `;
                tbody.appendChild(row);
            });
            // Muestra la tabla
            tableContainer.classList.remove('hidden');
        } else {
            alert('Error al obtener la lista de tickets');
        }
    } catch (error) {
        console.error('Error fetching tickets:', error);
        alert('Hubo un problema al obtener los tickets');
    }
}
