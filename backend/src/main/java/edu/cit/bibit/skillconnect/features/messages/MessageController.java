package edu.cit.bibit.skillconnect.features.messages;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.bibit.skillconnect.features.auth.NotificationController;

@RestController
@RequestMapping("/api/v1/messages")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/history")
    public ResponseEntity<List<Message>> getChatHistory(@RequestParam Long user1, @RequestParam Long user2) {
        return ResponseEntity.ok(messageRepository.findChatHistory(user1, user2));
    }

    @GetMapping("/contacts/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getContacts(@PathVariable Long userId) {
        List<Object[]> results = messageRepository.findActiveChatPartners(userId);
        List<Map<String, Object>> contacts = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", row[0]);
            map.put("name", row[1]);
            contacts.add(map);
        }
        return ResponseEntity.ok(contacts);
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        Message saved = messageRepository.save(message);

        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "NEW_MESSAGE");
        notification.put("senderId", saved.getSenderId());
        notification.put("senderName", saved.getSenderName());
        notification.put("message", "New message from " + saved.getSenderName());
        notification.put("content", saved.getContent());

        NotificationController.sendRealTimeNotification(saved.getReceiverId(), notification);

        return ResponseEntity.status(201).body(saved);
    }
}