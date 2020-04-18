function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password'
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password'
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password'
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password'
    },
  ]
}

function makeNotesArray(users) {
  return [
    {
      id: 1,
      title: 'First test note!',
      author_id: users[0].id,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      remynder: '5'
    },
    {
      id: 2,
      title: 'Second test note!',
      author_id: users[1].id,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      remynder: '6'
    },
    {
      id: 3,
      title: 'Third test note!',
      author_id: users[2].id,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      remynder: '12'
    },
    {
      id: 4,
      title: 'Fourth test note!',
      author_id: users[3].id,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      remynder: '24'
    },
  ]
}

function makeExpectedNotes(users, note) {
  const author = users
    .find(user => user.id === note.author_id)

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    author: {
      id: author.id,
      user_name: author.user_name,
      full_name: author.full_name,
      nickname: author.nickname,
    },
  }
}

function makeNotesFixtures() {
  const testUsers = makeUsersArray()
  const testNotes = makeNotesArray(testUsers)
  return { testUsers, testNotes }
}

function seedNotesTables(db, users, notes) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await trx.into('remynder_users').insert(users)
    await trx.into('notes').insert(notes)
    // update the auto sequence to match the forced id values
    await Promise.all([
      trx.raw(
        `SELECT setval('remynder_users_id_seq', ?)`,
        [users[users.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('notes_id_seq', ?)`,
        [notes[notes.length - 1].id],
      ),
    ])
  })
}

module.exports = {
  makeNotesArray,
  makeUsersArray,
  makeNotesFixtures,
  makeExpectedNotes,
  seedNotesTables
}