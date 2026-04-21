import * as contactService from '../services/contact.service.js';

export const submitMessage = async (req, res) => {
  try {
    const newMessage = await contactService.createMessage(req.body);
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit message' });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await contactService.getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const updated = await contactService.markMessageAsRead(parseInt(req.params.id));
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    await contactService.deleteMessage(parseInt(req.params.id));
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};