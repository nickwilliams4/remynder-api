const moment = require('moment')

const NotesService = {
  getAllNotes(knex, user_id) {
    return knex.select('*').from('notes').where('author_id', user_id)
    
  },

  getAllPastDueNotes(knex) {
    const currentUTCTimestamp = moment().utc().unix();
    return knex.select('*').from('notes').where('next_remynder', '<', currentUTCTimestamp)
  },

  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into('notes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex
      .from('notes')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteNotes(knex, id) {
    return knex('notes')
      .where({ id })
      .delete()
  },

  updateNote(knex, id, newNoteFields) {
    console.log('id and fields', id, newNoteFields);
    return knex('notes')
      .update({...newNoteFields})
      .where('id', id)
      .then(u => console.log(u))
      .catch(e => console.log(e));
  },
}

module.exports = NotesService