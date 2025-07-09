package com.example.coresystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.coresystem.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}