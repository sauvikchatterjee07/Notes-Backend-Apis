const express = require("express");
const Note = require("../models/Note"); // Adjust the path accordingly

// Create a note
async function createNote(req, res) {
    const userId = req.params.userId;
    try {
        const { title, content } = req.body;
        const note = new Note({
            title,
            content,
            userID: userId, // Correctly reference the userID field here
        });
        await note.save();
        res.status(201).send(note);
    } catch (error) {
        res.status(400).send(error);
    }
}

async function getAllNotes(req, res) {
    try {
        const notes = await Note.find();
        if (notes.length === 0) return res.send({ message: "No Notes found" });
        res.send(notes);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getNoteByUserId(req, res) {
    try {
        const note = await Note.find({
            userID: req.params.uid,
        });

        if (note.length === 0)
            return res
                .status(404)
                .send({ message: "Note not found based on User ID" });
        res.send(note);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getNoteByNoteId(req, res) {
    try {
        const note = await Note.find({
            _id: req.params.nid,
        });

        if (note.length === 0)
            return res
                .status(404)
                .send({ message: "Note not found based on the Note ID" });
        res.send(note);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function updateNote(req, res) {
    try {
        const { title, content } = req.body;
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, content },
            { new: true }
        );
        if (!note) return res.status(404).send("Note not found");
        res.send(note);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function deleteNote(req, res) {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!note) return res.status(404).send("Note not found");
        res.send(note);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    createNote,
    getAllNotes,
    getNoteByUserId,
    getNoteByNoteId,
    updateNote,
    deleteNote,
};
