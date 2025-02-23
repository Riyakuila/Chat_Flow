import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'

const OnlineUsers = () => {
  const { authUser } = useAuthStore()

  return (
    <div className="online-users">
      <h3>Online Users</h3>
      {/* Add your online users list UI here */}
    </div>
  )
}

export default OnlineUsers
