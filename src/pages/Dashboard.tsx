import { useAuth } from '../context/AuthContext'
import PatientDashboard from './dashboards/PatientDashboard'
import DoctorDashboard from './dashboards/DoctorDashboard'
import AdminDashboard from './dashboards/AdminDashboard'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  // Route to the correct role-based dashboard — role is from DB, never from user input at login
  switch (user.role) {
    case 'patient':
      return <PatientDashboard />
    case 'doctor':
      return <DoctorDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return <PatientDashboard />
  }
}
