package com.example.coresystem.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.coresystem.model.Notification;
import com.example.coresystem.repository.NotificationRepository;

@Service
public class NotificationService {
    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public List<Notification> findAll() {
        return repo.findAll();
    }

    public Notification save(Notification notification) {
        return repo.save(notification);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}