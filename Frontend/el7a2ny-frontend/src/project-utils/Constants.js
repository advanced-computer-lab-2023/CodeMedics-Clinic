const portNumber = 8000
const backendRoute = `http://localhost:${portNumber}`
const patientPrescriptionRoute = `${backendRoute}/patient/prescriptions`
const patientAppointmentRoute = `${backendRoute}/patient/getAllFamilyAppointments`
const familyMembersRoute = `http://localhost:${portNumber}/patient/familyMembers`

export{patientPrescriptionRoute, patientAppointmentRoute, familyMembersRoute}