import React from 'react'

const Contacts = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/comments")
  const contacts = await res.json()

  return (
    <div>Contacts</div>
  )
}

export default Contacts