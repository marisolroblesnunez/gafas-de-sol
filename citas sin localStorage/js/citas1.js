
        
        let citas= [];
        // let cita ={fechaYhora:'',nombre:'', tipo:'', telefono:'',notas:''};
      

        

        document.addEventListener('DOMContentLoaded', function() {
            // Elementos del DOM
            const timeSlotsContainer = document.querySelector('.time-slots');
            const appointmentsContainer = document.querySelector('.appointments');
            const currentDateInput = document.getElementById('current-date');
            const prevDayBtn = document.getElementById('prev-day');
            const nextDayBtn = document.getElementById('next-day');
            const appointmentModal = document.getElementById('appointment-modal');
            const appointmentForm = document.getElementById('appointment-form');
            const cancelAppointmentBtn = document.getElementById('cancel-appointment');
            const modalTitle = document.getElementById('modal-title');
            const appointmentTimeInput = document.getElementById('appointment-time');
            
            // Configurar fecha actual
            const today = new Date();
            const formattedToday = formatDateForInput(today);
            currentDateInput.value = formattedToday;
            
            // Generar horario de 8:00 AM a 6:00 PM con intervalos de 30 minutos
            function generateTimeSlots() {
                timeSlotsContainer.innerHTML = '';
                
                for (let hour = 8; hour < 18; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        const timeSlot = document.createElement('div');
                        timeSlot.className = 'time-slot';
                        timeSlot.textContent = timeString;
                        timeSlotsContainer.appendChild(timeSlot);
                    }
                }
            }


            // leer el datasorage
            function leerDelLocalStorage(){
                if(localStorage.getItem('citasGuardadas') !== null){
                    let datos = localStorage.getItem('citasGuardadas');
                    citas = JSON.parse(datos);
                    //updateSchedule();
                    citas.forEach(cita => {
                        displayCitas(cita);
                    });
                    
                }else{
                    citas = [];
                }
            }
            
            // Generar slots de citas
            function generateAppointmentSlots() {
                appointmentsContainer.innerHTML = '';
                
                for (let hour = 8; hour < 18; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        const appointmentSlot = document.createElement('div');
                        appointmentSlot.className = 'appointment-slot available';
                        appointmentSlot.dataset.time = timeString;
                        
                        // Simular algunas citas existentes (en una aplicación real, esto vendría de una base de datos)
                        if (Math.random() > 0.8) {
                            appointmentSlot.className = 'appointment-slot booked';
                            const name = `Paciente ${Math.floor(Math.random() * 100)}`;
                            const phone = `555-${Math.floor(1000 + Math.random() * 9000)}`;
                            
                            appointmentSlot.innerHTML = `
                                <div class="appointment-info">
                                    <div class="appointment-name">${name}</div>
                                    <div class="appointment-phone">${phone}</div>
                                </div>
                            `;
                        } else {
                            appointmentSlot.innerHTML = `
                                <div class="appointment-info">Disponible</div>
                            `;
                        }
                        
                        appointmentSlot.addEventListener('click', handleAppointmentSlotClick);
                        appointmentsContainer.appendChild(appointmentSlot);
                    }
                }
                // citas.forEach(cita => {
                //          const timeString = `${cita.time}`;
                //         const appointmentSlot = document.createElement('div');
                //         appointmentSlot.className = 'appointment-slot available';
                //         appointmentSlot.dataset.time = timeString;
                        
                //         // Simular algunas citas existentes (en una aplicación real, esto vendría de una base de datos)
                //             appointmentSlot.className = 'appointment-slot booked';
                //             const name = `Paciente ${cita.nombre}`;
                //             const phone = `${cita.telefono}`;
                            
                //             appointmentSlot.innerHTML = `
                //                 <div class="appointment-info">
                //                     <div class="appointment-name">${name}</div>
                //                     <div class="appointment-phone">${phone}</div>
                //                 </div>
                //             `;
                //             appointmentSlot.addEventListener('click', handleAppointmentSlotClick);
                //         appointmentsContainer.appendChild(appointmentSlot);
                // })
            }
            
            // Manejar clic en un slot de cita
            function handleAppointmentSlotClick(event) {
                const slot = event.currentTarget;
                console.log(slot)
                const time = slot.dataset.time;
                
                if (slot.classList.contains('available')) {
                    // Nueva cita
                    modalTitle.textContent = 'Nueva Cita';
                    appointmentTimeInput.value = time;
                    document.getElementById('patient-name').value = '';
                    document.getElementById('patient-phone').value = '';
                    document.getElementById('appointment-type').value = '';
                    document.getElementById('appointment-notes').value = '';
                    appointmentModal.style.display = 'flex';
                } else {
                    // Ver/Editar cita existente
                    modalTitle.textContent = 'Detalles de Cita';
                    appointmentTimeInput.value = time;
                    // Aquí normalmente cargarías los datos existentes de la cita
                    appointmentModal.style.display = 'flex';
                }
            }
            
            // Formatear fecha para input type="date"
            function formatDateForInput(date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            
            // Cambiar día
            function changeDate(days) {
                const currentDate = new Date(currentDateInput.value);
                currentDate.setDate(currentDate.getDate() + days);
                currentDateInput.value = formatDateForInput(currentDate);
                updateSchedule();
            }
            
            // Actualizar el horario
            function updateSchedule() {
                // En una aplicación real, aquí harías una petición al servidor
                // para obtener las citas de la fecha seleccionada
                generateAppointmentSlots();
            }
            
            // Event listeners
            prevDayBtn.addEventListener('click', () => changeDate(-1));
            nextDayBtn.addEventListener('click', () => changeDate(1));
            currentDateInput.addEventListener('change', updateSchedule);
            
            cancelAppointmentBtn.addEventListener('click', () => {
                appointmentModal.style.display = 'none';
            });
            
            appointmentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Aquí normalmente enviarías los datos al servidor
                const time = appointmentTimeInput.value;
                
                const date = document.getElementById('current-date').value;
                const name = document.getElementById('patient-name').value;
                const phone = document.getElementById('patient-phone').value;
                const type = document.getElementById('appointment-type').value;
                const notes = document.getElementById('appointment-notes').value;
                
                // Simular guardado
                console.log('Cita guardada:', { time, name, phone, type, notes });
                
 
   
                //comprobar si el producto existe en el carrito con la misma fecha
                const citaExiste = citas.findIndex(item => item.hora === time && item.fecha === date);


                if(citaExiste === -1){
                    citas.push({
                        fecha: date,
                        hora: time,
                        nombre: name,
                        telefono: phone,
                        tipo: type,
                        notas: notes,
                        
                    });
                }else{
                    //el producto ya está en el carrito
                    citas[citaExiste].fecha = date;
                    citas[citaExiste].nombre = name;
                    citas[citaExiste].telefono = phone;
                    citas[citaExiste].tipo = type;
                    citas[citaExiste].notas = notes;
                            
                }
                localStorage.setItem("citasGuardadas", JSON.stringify(citas))

                console.log(citas);
                
                // Actualizar la UI            
                                                                                    //NO LO ENTIENDO
                                                                                    console.log(time)
                const slot = document.querySelector(`.appointment-slot[data-time="${time}"]`);
                if (slot) {
                    slot.className = 'appointment-slot booked';
                    slot.innerHTML = `
                        <div class="appointment-info">
                            <div class="appointment-name">${name}</div>
                            <div class="appointment-phone">${phone}</div>
                        </div>
                    `;
                }
                
                appointmentModal.style.display = 'none';
            });
                                                                                                              //NO LO ENTIENDO
            // Cerrar modal haciendo clic fuera del contenido
            window.addEventListener('click', function(event) {
                if (event.target === appointmentModal) {
                    appointmentModal.style.display = 'none';
                }
            });
            
            // Inicializar
           
            generateTimeSlots();
            generateAppointmentSlots();
             leerDelLocalStorage();

        });


//mostrar una cita por pantalla
function displayCitas(cita){
                const slot = document.querySelector(`.appointment-slot[data-time="${cita.hora}"]`);
                console.log(cita.hora)
                if (slot) {
                    slot.className = 'appointment-slot booked';
                    slot.innerHTML = `
                        <div class="appointment-info">
                            <div class="appointment-name">${cita.nombre}</div>
                            <div class="appointment-phone">${cita.telefono}</div>
                           
                        </div>
                        <button class="eliminar">&#128465;</button>
                    `;
                }
}
//realizar busquedas
function buscarPaciente(){
    const buscando = document.getElementById('busqueda').value;
    if(buscando.trim()=== ''){
        return
    }

    

}

//         const li= document.createElement("li");//aqui creo el li
// //aqui añado el contenido que va a tener el li que he creado
// li.innerHTML=`

//     <div data-id="${citas.id}">
//         <input  type="checkbox" class="citaRealizada">
               
//                 ${citas.time} 
//                 <span class="texto-tarea">
//                 ${citas.name}
//                 ${citas.phone}
//                 ${citas.date}
//                 ${citas.type}
//                 ${citas.notes}
//                 </span>
//     </div>
//     <button class="eliminar">&#128465;</button>`;//&#128465; este código lo he puesto para añadirle una papelera al boton de eliminar

//     document.getElementById("citas").appendChild(li);//aqui añado li como hijo
 
// li.querySelector(".eliminar").addEventListener("click", function(){
//     //averiguar que id tiene la tarea
//     let idCita = li.querySelector("div").getAttribute("data-id");//para saber exactamente la tarea que estoy borrando
//     citas = citas.filter(item => item.id != idCita);//crea un nuevo array con todos los elementos que cumplan la condicion que hay dentro del parentesis, porque realmente para poder modificar el array sin hacer esto,
//     // es igual que el push pero el push lo modifica, y esta nueva forma, crea uno nuevo. El push que es un ejemplo que he metido en -arrays.js-
//     localStorage.setItem("citasGuardadas",JSON.stringify(citas));
//     console.log(citas)
//     //borrar tarea de la pantalla
//     li.remove();
// //esto es para eliminar la tarea
// })