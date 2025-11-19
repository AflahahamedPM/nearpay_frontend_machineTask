import React from 'react'
import { DashboardProvider } from '../providers/DashboardProvider'
import DashboardContainer from '../components/dashboard/DashboardContainer'

const Dashboard = () => {
  return (
    <DashboardProvider>
        <DashboardContainer />
    </DashboardProvider>
  )
}

export default Dashboard