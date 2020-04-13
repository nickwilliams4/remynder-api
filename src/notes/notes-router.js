const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')
const { requireAuth } = require('../middleware/jwt-auth')
const moment = require('moment')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  title: note.title,
  content: xss(note.content),
  created: note.created,
  remynder: note.remynder,
  author_id: note.author_id
})

notesRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance, req.user.id)
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { title, content, remynder } = req.body
    console.log("POST TO /NOTES")
    const newNote = { title, content, remynder }

    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      newNote.author_id = req.user.id

     const remynder_hours = parseInt(remynder);

    newNote.next_remynder = moment().utc().add(remynder_hours, 'hours').unix();

    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note))
      })
      .catch((err) => {
        console.log(err);
        next();
      })
  })

notesRouter
  .route('/:note_id')
  .all(requireAuth)
  .all((req, res, next) => {
    NotesService.getById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note))
  })
  .delete((req, res, next) => {
    NotesService.deleteNotes(
      req.app.get('db'),
      req.params.note_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { content, created, remynder } = req.body
    const noteToUpdate = { content, created, remynder }

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'content' or 'created`
        }
      })

    NotesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = notesRouter