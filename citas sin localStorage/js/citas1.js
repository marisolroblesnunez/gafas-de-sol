
        
        let citas= []
        let cita ={fecha:'',nombre:'', tipo:'', telefono:'',notas:''};
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
            }
            
            // Manejar clic en un slot de cita
            function handleAppointmentSlotClick(event) {
                const slot = event.currentTarget;
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
                const name = document.getElementById('patient-name').value;
                const phone = document.getElementById('patient-phone').value;
                const type = document.getElementById('appointment-type').value;
                const notes = document.getElementById('appointment-notes').value;
                
                // Simular guardado
                console.log('Cita guardada:', { time, name, phone, type, notes });
                
 
   
                //comprobar si el producto existe en el carrito con la misma fecha
                const citaExiste = citas.findIndex(item => item.date === time );


                if(citaExiste === -1){
                    citas.push({time, name, phone, type, notes});
                }else{
                    //el producto ya está en el carrito
                    citas[citaExiste].nombre = name;
                    citas[citaExiste].telefono = phone;
                    citas[citaExiste].tipo = type;
                    citas[citaExiste].notas = notes;
                            
                }



                citas.push({ time, name, phone, type, notes })
                localStorage.setItem("citasGuardadas", citas)

                console.log(citas)
                
                // Actualizar la UI
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
            
            // Cerrar modal haciendo clic fuera del contenido
            window.addEventListener('click', function(event) {
                if (event.target === appointmentModal) {
                    appointmentModal.style.display = 'none';
                }
            });
            
            // Inicializar
            generateTimeSlots();
            generateAppointmentSlots();
        });
    